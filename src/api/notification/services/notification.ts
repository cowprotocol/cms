/**
 * notification service
 */

import { factories } from '@strapi/strapi';

const MODULE_ID = 'api::notification.notification'

export default factories.createCoreService(MODULE_ID, ({ strapi }) => {
  return {
    async getNotificationList(account: string, push: boolean) {
      const notifications = await strapi.entityService.findMany(
        MODULE_ID,
        {
          start: 0,
          limit: 50,
          filters: {
            account,
            notification_template: { push }
          },
          populate: {
            notification_template: {
              fields: ['id', 'title', 'description', 'url', 'push', 'thumbnail']
            }
          },
        }
      )

      return notifications.map(notification => ({
        id: notification.id,
        title: notification.notification_template.title,
        description: templateNotification(notification.notification_template.description, notification.data),
        url: notification.notification_template.url,
        thumbnail: notification.notification_template.thumbnail
      }))
    },
  }
});

function templateNotification(description: string, data: {[key: string]: string}): string {
  let result = description

  Object.keys(data).forEach(key => {
    result = result.replace(`{{ ${key} }}`, data[key])
  })

  return result
}
