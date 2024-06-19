import { NotificationRaw } from './parseNotification';

const NOTIFICATIONS_KEYS: (keyof NotificationRaw)[] = ['templateId', 'account', 'data']

export function validateNotifications(notifications: NotificationRaw[], notificationMap: Record<number, number>) {
  notifications.forEach((notification, index) => {
    if (NOTIFICATIONS_KEYS.some(key => !notification[key])) {
      console.error('Invalid notification', notification)

      throw new Error('Invalid notification, index: ' + index)
    }

    if (!notificationMap[notification.templateId]) {
      throw new Error('Invalid notification template: ' + notification.templateId)
    }
  })
}
