import { Strapi } from '@strapi/strapi';
import { parseNotificationsFile } from './parseNotificationsFile';
import { parseNotification, NotificationRaw } from './parseNotification';
import { validateNotifications } from './validateNotifications';

const NOTIFICATIONS_MODULE_ID = 'api::notification.notification'
const NOTIFICATION_TEMPLATES_MODULE_ID = 'api::notification-template.notification-template'

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('import-notifications')
      .service('myService')
      .getWelcomeMessage();
  },
  async csv(ctx) {
    const file = ctx.request.files?.['file']

    if (!file) return {error: 'File is required'}

    const rows: string[][] = await parseNotificationsFile(file.path)

    let templatesMap = null;
    let notifications: NotificationRaw[] = [];

    try {
      notifications = parseNotification(rows)

      const templates = await strapi.entityService.findMany(
        NOTIFICATION_TEMPLATES_MODULE_ID,
        {
          fields: ['id']
        }
      );

      templatesMap = templates.reduce((acc, template) => {
        acc[template.id] = template.id
        return acc
      }, {})

      validateNotifications(notifications, templatesMap)
    } catch (e) {
      console.error('CSV parsing error', e)
      return {error: e.message}
    }

    if (!templatesMap || !notifications.length) return

    try {
      await Promise.all(
        notifications.map(notification => {
          const {templateId, account, data} = notification

          return strapi.entityService.create(
            NOTIFICATIONS_MODULE_ID,
            {
              data: {
                account,
                data,
                notification_template: {connect: [{id: templateId}]}
              },
            }
          );
        })
      )
    } catch (e) {
      console.error('CSV creating error', e)
      return {error: 'Cannot create notifications'}
    }

    return { status: 'ok' }
  },
});
