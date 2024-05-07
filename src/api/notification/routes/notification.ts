/**
 * notification router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::notification.notification');


const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: 'GET',
    path: '/notification-list/:account',
    handler: 'notification.getNotificationList',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/push-notifications/:account',
    handler: 'notification.getPushNotifications',
    config: {
      policies: [],
      middlewares: [],
    },
  }
];

export default customRouter(defaultRouter, myExtraRoutes);
