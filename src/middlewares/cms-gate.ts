import { createHash, timingSafeEqual } from 'crypto';
import { posix } from 'path';

/**
 * Admin gate. The admin panel and admin APIs are meant to be reached only through
 * cms-admin.cow.fi, where oauth2-proxy (Google login) injects X-CMS-Gate. Every request
 * that isn't public content needs that header, whichever hostname it came in on
 * (cms.cow.fi, the generated strapiapp.com one, or a spoofed Host header).
 * The proxy lives in cowprotocol/infrastructure (cms/index.ts).
 *
 * CMS_GATE_SECRET unset turns the gate off: local development, and the rollback switch.
 */

// Public with any method: the content API, which holds all custom routes.
const PUBLIC_API_PREFIX = '/api';
// Public for GET/HEAD only. /documentation also hosts the documentation plugin's
// admin endpoints, which must stay behind the gate for writes.
const PUBLIC_READ_PREFIXES = [
  '/uploads',
  '/_health',
  '/documentation',
  // Swagger UI, served from public/
  '/swagger.html',
  '/swagger-initializer.js',
  '/swagger-ui-v5.15.2',
  '/robots.txt',
  '/favicon.ico',
];

// At most one alert per client IP in this window; every occurrence is still logged.
const ALERT_INTERVAL_MS = 5 * 60_000;

const matchesPrefix = (path: string, prefix: string) => path === prefix || path.startsWith(`${prefix}/`);

const isPublic = (method: string, rawPath: string) => {
  let path: string;
  try {
    // Match on the path the router could end up serving: /api/../admin is /admin.
    path = posix.normalize(decodeURIComponent(rawPath));
  } catch {
    // Malformed percent-encoding is never public.
    return false;
  }
  if (matchesPrefix(path, PUBLIC_API_PREFIX)) {
    return true;
  }
  return (method === 'GET' || method === 'HEAD') && PUBLIC_READ_PREFIXES.some((prefix) => matchesPrefix(path, prefix));
};

const digest = (value: string) => createHash('sha256').update(value).digest();

const lastAlertAt = new Map<string, number>();

// Same shape as the other native Alertmanager alerts in cowprotocol/infrastructure.
// team=security-team routes it to #alerts-security. Fire and forget: alerting must
// never delay or fail the request.
const sendAlert = (clientIp: string, method: string, path: string, email: string) => {
  const { ALERTMANAGER_URL, ALERTMANAGER_USERNAME, ALERTMANAGER_PASSWORD } = process.env;
  if (!ALERTMANAGER_URL) {
    return;
  }
  const now = Date.now();
  if (now - (lastAlertAt.get(clientIp) ?? 0) < ALERT_INTERVAL_MS) {
    return;
  }
  lastAlertAt.set(clientIp, now);

  const alert = {
    labels: {
      alertname: 'CmsGateUnexpectedIp',
      severity: 'warning',
      team: 'security-team',
      source: 'cms',
      client_ip: clientIp,
    },
    annotations: {
      summary: `CMS gate secret used from unexpected IP ${clientIp}`,
      description: [
        `A request with a valid X-CMS-Gate came from ${clientIp}, which is not in CMS_GATE_EGRESS_IPS.`,
        'Either the gate secret has leaked (rotate it in 1Password and Strapi Cloud) or the egress IPs changed.',
        `Request: ${method} ${path}`,
        `X-Forwarded-Email (unverified): ${email || 'n/a'}`,
      ].join('\n'),
    },
    startsAt: new Date(now).toISOString(),
  };
  const auth = Buffer.from(`${ALERTMANAGER_USERNAME}:${ALERTMANAGER_PASSWORD}`).toString('base64');

  strapi
    .fetch(`${ALERTMANAGER_URL}/api/v2/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
      body: JSON.stringify([alert]),
      timeout: 10_000,
    })
    .then(async (res) => {
      if (!res.ok) {
        strapi.log.error(`cms_gate_alert_failed: Alertmanager responded ${res.status}: ${await res.text()}`);
      }
    })
    .catch((error) => strapi.log.error(`cms_gate_alert_failed: ${error}`));
};

export default () => {
  const secret = process.env.CMS_GATE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      strapi.log.warn('CMS_GATE_SECRET is not set: the admin gate is off');
    }
    return async (ctx, next) => next();
  }

  const expected = digest(secret);
  // Unset: no IP check (barn reaches Strapi from inside the cluster, local development).
  const egressIps = new Set(
    (process.env.CMS_GATE_EGRESS_IPS ?? '')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean),
  );
  // The client IP as seen by the hosting edge. Clients can fill X-Forwarded-For themselves.
  const clientIpHeader = process.env.CMS_GATE_CLIENT_IP_HEADER || 'cf-connecting-ip';

  return async (ctx, next) => {
    if (isPublic(ctx.method, ctx.path)) {
      return next();
    }
    // Comparing digests keeps the comparison constant-time whatever the header's length.
    if (!timingSafeEqual(digest(ctx.get('X-CMS-Gate')), expected)) {
      ctx.status = 403;
      ctx.body = 'Forbidden';
      return;
    }

    // Log only, never block: a valid secret from an unknown IP means it has leaked, but
    // a NAT failover IP missing from the list must not lock editors out.
    const clientIp = ctx.get(clientIpHeader);
    if (egressIps.size > 0 && !egressIps.has(clientIp)) {
      const email = ctx.get('X-Forwarded-Email');
      strapi.log.warn(
        `cms_gate_unexpected_ip: ${clientIpHeader}=${clientIp || 'n/a'} ` +
          `x-forwarded-for=${ctx.get('X-Forwarded-For') || 'n/a'} ` +
          `${ctx.method} ${ctx.path} email=${email || 'n/a'}`,
      );
      sendAlert(clientIp || 'unknown', ctx.method, ctx.path, email);
    }

    return next();
  };
};
