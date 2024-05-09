/**
 * notification service
 */

import { factories } from '@strapi/strapi';

const MODULE_ID = 'api::notification.notification'
const GLOBAL_MODULE_ID = 'api::notifications-consumer.notifications-consumer'
const SINGLETON_ID = 1

export default factories.createCoreService(MODULE_ID, ({ strapi }) => {
  return {
    async getNotificationList(account: string) {
      const notifications = await strapi.entityService.findMany(
        MODULE_ID,
        {
          start: 0,
          limit: 50,
          filters: {
            account,
            notification_template: { push: false }
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

      return notifications.map(notification => ({
        id: notification.id,
        account: notification.account,
        title: notification.notification_template.title,
        description: templateNotification(notification.notification_template.description, notification.data),
        url: notification.notification_template.url,
        createdAt: notification.createdAt,
        thumbnail: notification.notification_template.thumbnail.url
      }))
    },
    async getPushNotifications() {
      const global = await strapi.entityService.findOne(GLOBAL_MODULE_ID, SINGLETON_ID, {
        populate: ['id', 'lastConsumedNotificationDate']
      })

      const lastConsumedNotificationDate = global?.lastConsumedNotificationDate

      return strapi.entityService.findMany(
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
    },
    updateLastConsumedNotificationDate() {
      return strapi.entityService.update(
        GLOBAL_MODULE_ID,
        SINGLETON_ID,
        {
          data: { lastConsumedNotificationDate: new Date() }
        }
      )
    }
  }
});

export function templateNotification(description: string, data: {[key: string]: string}): string {
  let result = description

  if (!data) return result

  Object.keys(data).forEach(key => {
    result = result.replace(`{{ ${key} }}`, data[key])
  })

  return result
}
