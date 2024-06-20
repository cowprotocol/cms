/**
 * notification service
 */

import { factories } from '@strapi/strapi';

const MODULE_ID = 'api::notification.notification'
const GLOBAL_MODULE_ID = 'api::notifications-consumer.notifications-consumer'
const SINGLETON_ID = 1

const NOTIFICATIONS_POPULATE = {
  notification_template: {
    fields: ['id', 'title', 'description', 'url', 'push'],
    populate: {
      thumbnail: {
        fields: ['url']
      }
    }
  }
}

const notificationsTemplateFilter = (push: boolean) => ({
  $or: [
    {
      push,
      dueDate: { $gt: new Date() }
    },
    {
      push,
      dueDate: { $null: true }
    }
  ]
})

export default factories.createCoreService(MODULE_ID, ({ strapi }) => {
  return {
    async getNotificationsForAll(push: boolean) {
      return strapi.entityService.findMany(
        MODULE_ID,
        {
          start: 0,
          limit: 50,
          filters: {
            account: { $null: true },
            notification_template: notificationsTemplateFilter(push)
          },
          populate: NOTIFICATIONS_POPULATE
        }
      )
    },
    async getNotificationList(account: string) {
      const push = false
      const templateFilter = notificationsTemplateFilter(push)
      const notifications = await strapi.entityService.findMany(
        MODULE_ID,
        {
          start: 0,
          limit: 50,
          filters: {
            $or: [
              { account, notification_template: templateFilter },
              { account: account.toLowerCase(), notification_template: templateFilter },
            ]
          },
          populate: NOTIFICATIONS_POPULATE
        }
      )
      const notificationsForAll = await this.getNotificationsForAll(push)

      return [...notifications, ...notificationsForAll].map(notification => ({
        id: notification.id,
        account: notification.account,
        title: notification.notification_template.title,
        description: templateNotification(notification.notification_template.description, notification.data),
        dueDate: notification.notification_template.dueDate,
        url: notification.notification_template.url,
        createdAt: notification.createdAt,
        thumbnail: notification.notification_template.thumbnail?.url
      }))
    },
    async getPushNotifications() {
      const push = true
      const global = await strapi.entityService.findOne(GLOBAL_MODULE_ID, SINGLETON_ID, {
        populate: ['id', 'lastConsumedNotificationDate']
      })

      const lastConsumedNotificationDate = global?.lastConsumedNotificationDate

      return strapi.entityService.findMany(
        MODULE_ID,
        {
          limit: 200,
          filters: {
            notification_template: notificationsTemplateFilter(push),
            ...(lastConsumedNotificationDate ? {
              createdAt: {$gt: lastConsumedNotificationDate}
            } : undefined)
          },
          populate: NOTIFICATIONS_POPULATE
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
