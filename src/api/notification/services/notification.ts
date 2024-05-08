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
  }
});

function templateNotification(description: string, data: {[key: string]: string}): string {
  let result = description

  if (!data) return result

  Object.keys(data).forEach(key => {
    result = result.replace(`{{ ${key} }}`, data[key])
  })

  return result
}
