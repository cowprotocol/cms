/**
 * notification controller
 */

import { factories } from '@strapi/strapi'

const MODULE_ID = 'api::notification.notification'
const GLOBAL_MODULE_ID = 'api::notifications-consumer.notifications-consumer'
const SINGLETON_ID = 1

export default factories.createCoreController(MODULE_ID, ({ strapi }) => {
  return {
    async getNotificationList(context) {
      const account = context.params.account

      return strapi.service(MODULE_ID).getNotificationList(account)
    },

    async getPushNotifications() {
      const global = await strapi.entityService.findOne(GLOBAL_MODULE_ID, SINGLETON_ID, {
        populate: ['id', 'lastConsumedNotificationDate']
      })

      const lastConsumedNotificationDate = global?.lastConsumedNotificationDate

      const notifications = await strapi.entityService.findMany(
        MODULE_ID,
        {
          limit: 200,
          filters: {
            notification_template: { push: true },
            ...(lastConsumedNotificationDate ? {
              createdAt: {$gt: lastConsumedNotificationDate}
            } : undefined)
          },
          populate: {
            notification_template: {
              fields: ['id', 'title', 'description', 'url', 'push'],
              populate: {
                thumbnail: {
                  fields: ['url']
                }
              }
            }
          }
        }
      )

      if (notifications.length) {
        await strapi.entityService.update(
          GLOBAL_MODULE_ID,
          SINGLETON_ID,
          {
            data: { lastConsumedNotificationDate: new Date() }
          }
        )
      }

      return notifications
    },
  }
});
