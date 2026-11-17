export default [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  // Before strapi::body, so rejected requests are never parsed.
  'global::cms-gate',
  'strapi::query',
  'strapi::body',
  'global::cleanup-uploads',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
