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

      const isAlreadySubscribed = await this.checkSubscription(context)

      if (isAlreadySubscribed) {
        return true
      }

      await service.addSubscription(account, data)

      return true
    },
    async checkSubscription(context) {
      const {account, data} : { account: string, data: TelegramData } = context.request.body

      const service = strapi.service(MODULE_ID)

      const result = await service.verifyTgAuthentication(data)

      /**
       * Verify if the Telegram authentication data is valid
       * Which proves that the data belongs to the user
       */
      if (!result) {
        throw new errors.ValidationError('Invalid telegram authentication data')
      }

      const existing = await strapi.entityService.findMany(MODULE_ID, { filters: { account, chatId: data.id } })

      /**
       * We will only return true if the subscription belongs to the Telegram owner
       * And the account is already subscribed
       * So, it's not possible to check another account's subscription without owning Telegram account
       */
      return existing.length > 0
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
