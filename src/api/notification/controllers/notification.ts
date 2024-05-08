/**
 * notification controller
 */

import { factories } from '@strapi/strapi'

const MODULE_ID = 'api::notification.notification'

export default factories.createCoreController(MODULE_ID, ({ strapi }) => {
  return {
    async getNotificationList(context) {
      const account = context.params.account

      return strapi.service(MODULE_ID).getNotificationList(account, false)
    },

    async getPushNotifications(context) {
      const account = context.params.account

      return strapi.service(MODULE_ID).getNotificationList(account, true)
    },
  }
});
