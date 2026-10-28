import { rm } from 'fs/promises';

/**
 * strapi::body writes every multipart file to the OS temp dir before routing, so any
 * request (including scanner traffic to routes that don't exist) can drop files there.
 * Strapi only removes the field named `files` afterwards, and skips that when the request
 * throws. Remove every uploaded file once the request is done, whatever the outcome.
 *
 * Must be registered after strapi::body, which deletes ctx.request.files on its way out.
 */
export default () => async (ctx, next) => {
  try {
    await next();
  } finally {
    // formidable 1 (Strapi 4) sets `path`; formidable 2+ (Strapi 5) renames it to `filepath`.
    const paths = (Object.values(ctx.request.files ?? {}).flat() as { filepath?: string; path?: string }[])
      .map((file) => file.filepath ?? file.path)
      .filter(Boolean);
    const results = await Promise.allSettled(paths.map((path) => rm(path, { force: true })));
    results
      .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
      .forEach(({ reason }) => strapi.log.error(`Failed to remove uploaded temp file: ${reason}`));
  }
};
