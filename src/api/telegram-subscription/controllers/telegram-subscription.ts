/**
 * telegram-subscription controller
 */

import { factories } from '@strapi/strapi'
import { errors } from '@strapi/utils'
import { TelegramData } from '../types'

const MODULE_ID = 'api::telegram-subscription.telegram-subscription'

export default factories.createCoreController(MODULE_ID, ({strapi}) => {
  return {
    async addSubscription(context) {
      const {account, data} : { account: string, data: TelegramData } = context.request.body

      const service = strapi.service(MODULE_ID)

      const existing = await strapi.entityService.findMany(MODULE_ID, { filters: { account, chat_id: data.id } })

      if (existing.length > 0) return true

      const result = await service.verifyTgAuthentication(data)

      if (!result) {
        throw new errors.ValidationError('Invalid telegram authentication data')
      }

      await service.addSubscription(account, data)

      return true
    },
    async getSubscriptions(context) {
      const { accounts } = context.query

      const accountsArray = accounts ? accounts.split(',') : []

      if (!accountsArray.length) return []

      return strapi.service(MODULE_ID).getSubscriptions(accountsArray)
    },
    async getAccountSubscriptions(context) {
      const account = context.params.account

      return strapi.service(MODULE_ID).getAccountSubscriptions(account)
    },
    async sendNotifications(context) {
      return strapi.service(MODULE_ID).sendNotifications()
    }
  }
});
