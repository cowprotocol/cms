export * from "./gen/types";

import createClient from "openapi-fetch";
import type { paths } from "./gen/types";

export interface CmsClientOptions {
  url?: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

/**
 * Open API Fetch client. See docs for usage https://openapi-ts.pages.dev/openapi-fetch/
 */
export function CmsClient(options: CmsClientOptions = {}) {
  const {
    url = "https://cms.cow.fi/api",
    headers: baseHeaders = {},
    apiKey,
  } = options;
  return createClient<paths>({
    baseUrl: url,
    headers: {
      ...baseHeaders,
      ...(apiKey
        ? {
            Authorization: "Bearer " + apiKey,
          }
        : {}),
    },
  });
}
