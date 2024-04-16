export * from "./gen/types";

import createClient from "openapi-fetch";
import type { paths, components } from "./gen/types";

export interface CmsClientOptions {
  url?: string;
}

/**
 * Open API Fetch client. See docs for usage https://openapi-ts.pages.dev/openapi-fetch/
 */
export function CmsClient(options: CmsClientOptions = {}) {
  const { url = "https://cms.cow.fi/api" } = options;
  return createClient<paths>({
    baseUrl: url,
  });
}
