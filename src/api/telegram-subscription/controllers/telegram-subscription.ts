/**
 * telegram-subscription controller
 */

import { factories } from '@strapi/strapi'
import { errors } from '@strapi/utils'

const MODULE_ID = 'api::telegram-subscription.telegram-subscription'

export default factories.createCoreController(MODULE_ID, ({strapi}) => {
  return {
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
    async linkViaBot(context) {
      const { account, chatId, firstName, username } = context.request.body as {
        account?: string
        chatId?: number
        firstName?: string
        username?: string
      }

      if (!account || !chatId) {
        throw new errors.ValidationError('account and chatId are required')
      }

      const service = strapi.service(MODULE_ID)

      await service.linkSubscriptionViaBot(account, { chatId, firstName, username })

      return { success: true }
    },
    async unlinkViaBot(context) {
      const { account } = context.request.body as { account?: string }

      if (!account) {
        throw new errors.ValidationError('account is required')
      }

      const service = strapi.service(MODULE_ID)

      await service.unlinkSubscriptionViaBot(account)

      return { success: true }
    },
    async getAccountsByChatViaBot(context) {
      const { chatId } = context.request.body as { chatId?: number }

      if (!chatId) {
        throw new errors.ValidationError('chatId is required')
      }

      return strapi.service(MODULE_ID).getAccountsByChatId(chatId)
    }
  }
});
