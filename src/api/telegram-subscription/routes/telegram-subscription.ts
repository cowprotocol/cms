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
    path: '/subscriptions/telegram',
    handler: 'telegram-subscription.getSubscriptions',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'GET',
    path: '/accounts/:account/subscriptions/telegram',
    handler: 'telegram-subscription.getAccountSubscriptions',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'POST',
    path: '/telegram-subscription/link-via-bot',
    handler: 'telegram-subscription.linkViaBot',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'POST',
    path: '/telegram-subscription/unlink-via-bot',
    handler: 'telegram-subscription.unlinkViaBot',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'POST',
    path: '/telegram-subscription/accounts-by-chat-via-bot',
    handler: 'telegram-subscription.getAccountsByChatViaBot',
    config: {
      policies: [],
      middlewares: [],
    },
  },
];

export default customRouter(defaultRouter, myExtraRoutes);
