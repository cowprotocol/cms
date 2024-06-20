/**
 * telegram-subscription service
 */

import { factories } from '@strapi/strapi'
import { env } from '@strapi/utils'
import fetch from 'node-fetch'
import crypto from 'crypto'
import { TelegramData } from '../types'
import { templateNotification } from '../../notification/services/notification'

const MODULE_ID = 'api::telegram-subscription.telegram-subscription'

const SEND_MESSAGE_URL = `https://api.telegram.org/bot${env('TELEGRAM_SECRET')}/sendMessage`

export default factories.createCoreService(MODULE_ID, ({strapi}) => {
  return {
    async verifyTgAuthentication(data: TelegramData) {
      const dataString = Object.keys(data).reduce((acc, key) => {
        if (key === 'hash') return acc

        acc.push(`${key}=${data[key]}`)
        return acc
      }, []).sort().join('\n')

      const secretHash = crypto.createHash('sha256').update(env('TELEGRAM_SECRET')).digest('base64')
      const result = crypto.createHmac('sha256', new Buffer(secretHash, 'base64')).update(dataString).digest('hex')

      return result === data.hash
    },
    async addSubscription(account: string, data: TelegramData) {
      return strapi.entityService.create(
        MODULE_ID,
        {
          data: {
            account,
            auth_date: data.auth_date,
            first_name: data.first_name,
            hash: data.hash,
            chat_id: data.id,
            photo_url: data.photo_url,
            username: data.username,
          }
        })
    },
    async getSubscriptions(accounts: string[]) {
      return strapi.entityService.findMany(
        MODULE_ID,
        {
          filters: {
            account: {
              $in: accounts
            }
          },
          fields: ['id', 'account', 'chat_id']
        }
      )
    },
    async getAccountSubscriptions(account: string) {
      return strapi.entityService.findMany(
        MODULE_ID,
        {
          filters: {
            account
          },
          fields: ['id', 'account', 'chat_id']
        }
      )
    },
    // TODO: temporary implementation
    async sendNotifications(): Promise<number> {
      const notifications = await strapi.service('api::notification.notification').getPushNotifications()

      if (notifications.length === 0) return 0

      const subscriptions = await this.getSubscriptions(notifications.map(n => n.account))

      const requests = subscriptions.map(subscription => {
        return notifications.map(notification => {
          return fetch(SEND_MESSAGE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chat_id: subscription.chat_id,
              text: templateNotification(notification.notification_template.description, notification.data)
            })
          })
        })
      }).flat()

      await Promise.all(requests)

      return requests.length
    }
  }
});
