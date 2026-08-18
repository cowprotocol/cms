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
const telegramSecret = env('TELEGRAM_SECRET') as string

const SEND_MESSAGE_URL = `https://api.telegram.org/bot${telegramSecret}/sendMessage`

export default factories.createCoreService(MODULE_ID, ({strapi}) => {
  return {
    async verifyTgAuthentication(data: TelegramData) {
      if (!telegramSecret) {
        throw new Error('verifyTgAuthentication - telegram secret is not set!')
      }

      const dataString = Object.keys(data).reduce((acc, key) => {
        if (key === 'hash') return acc

        acc.push(`${key}=${data[key]}`)
        return acc
      }, []).sort().join('\n')

      const secretHash = crypto.createHash('sha256').update(telegramSecret).digest('base64')
      const result = crypto.createHmac('sha256', new Buffer(secretHash, 'base64')).update(dataString).digest('hex')

      return result === data.hash
    },
    async addSubscription(account: string, data: TelegramData) {
      return strapi.entityService.create(
        MODULE_ID,
        {
          data: {
            account: account.toLowerCase(),
            authDate: data.auth_date,
            firstName: data.first_name,
            hash: data.hash,
            chatId: data.id,
            photoUrl: data.photo_url,
            username: data.username,
          }
        })
    },
    async removeSubscriptions(account: string) {
      const subscriptions = await this.getAccountSubscriptions(account)

      for (const subscription of subscriptions) {
        await strapi.entityService.delete(MODULE_ID, subscription.id)
      }

      return true
    },
    async getSubscriptions(accounts: string[]): Promise<{id: string, account: string, chatId: string}[]> {
      return strapi.entityService.findMany(
        MODULE_ID,
        {
          filters: {
            $or: accounts.map(account => ({ account: { $eqi: account } }))
          },
          fields: ['id', 'account', 'chatId']
        }
      )
    },
    async getAccountSubscriptions(account: string): Promise<{id: string, account: string, chatId: string}[]> {
      return strapi.entityService.findMany(
        MODULE_ID,
        {
          filters: {
            account: {
              $eqi: account
            }
          },
          fields: ['id', 'account', 'chatId']
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
              chat_id: subscription.chatId,
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
