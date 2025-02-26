/**
 * solver-network router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/solver-network/search',
      handler: 'solver-network.search',
      config: {
        auth: false, // TODO: Should this be true?
      },
    },
  ],
};

