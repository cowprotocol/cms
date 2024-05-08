/**
 * telegram-subscription router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::telegram-subscription.telegram-subscription');

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
    path: '/tg-subscriptions/:account',
    handler: 'telegram-subscription.getSubscriptions',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'POST',
    path: '/add-tg-subscription',
    handler: 'telegram-subscription.addSubscription',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/send-tg-notifications/:account',
    handler: 'telegram-subscription.sendNotifications',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];

export default customRouter(defaultRouter, myExtraRoutes);
