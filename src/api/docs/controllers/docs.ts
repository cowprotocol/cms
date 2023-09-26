"use strict";

import fs from "fs-extra";
import path from "path";

export default {
  async getSwaggerDocs(ctx) {
    try {
      const { major, minor, patch } = ctx.params;
      const version =
        major && minor && patch
          ? `${major}.${minor}.${patch}`
          : strapi.plugins.documentation.config("info.version", "1.0.0");

      const openAPISpecsPath = path.join(
        "src",
        "extensions",
        "documentation",
        "documentation",
        version,
        "full_documentation.json"
      );

      const documentation = fs.readFileSync(openAPISpecsPath, "utf8");
      const response = JSON.parse(documentation);

      ctx.send(response);
    } catch (e) {
      strapi.log.error(e);
      ctx.badRequest(null, e.message);
    }
  },
};
