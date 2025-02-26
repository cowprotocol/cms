/**
 * solver-network controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::solver-network.solver-network', ({ strapi }) => ({
  async search(ctx) {
    try {
      const queryParams = ctx.request.query;
      const results = await strapi.service('api::solver-network.solver-network').search(queryParams);
      return ctx.send(results);
    } catch (error) {
      return ctx.throw(500, error);
    }
  },
}));
