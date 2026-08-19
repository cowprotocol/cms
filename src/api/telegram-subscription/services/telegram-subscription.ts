/**
 * telegram-subscription service
 */

import { factories } from '@strapi/strapi'

const MODULE_ID = 'api::telegram-subscription.telegram-subscription'

export default factories.createCoreService(MODULE_ID, ({strapi}) => {
  return {
    async removeSubscriptions(account: string) {
      const subscriptions = await this.getAccountSubscriptions(account)

      for (const subscription of subscriptions) {
        await strapi.entityService.delete(MODULE_ID, subscription.id)
      }

      return true
    },
    async linkSubscriptionViaBot(
      account: string,
      telegram: { chatId: number; firstName?: string; username?: string }
    ) {
      const normalizedAccount = account.toLowerCase()
      const existing = await this.getAccountSubscriptions(normalizedAccount)

      if (existing.length > 0) {
        // Already linked (e.g. user tapped /start twice) — idempotent no-op,
        // unless the Telegram identity changed (e.g. re-linked from a different chat)
        if (String(existing[0].chatId) !== String(telegram.chatId)) {
          return strapi.entityService.update(
            MODULE_ID,
            existing[0].id,
            {
              data: {
                chatId: telegram.chatId,
                firstName: telegram.firstName,
                username: telegram.username,
              }
            })
        }

        return existing[0]
      }

      return strapi.entityService.create(
        MODULE_ID,
        {
          data: {
            account: normalizedAccount,
            chatId: telegram.chatId,
            firstName: telegram.firstName,
            username: telegram.username,
          }
        })
    },
    async unlinkSubscriptionViaBot(account: string) {
      const normalizedAccount = account.toLowerCase()
      return this.removeSubscriptions(normalizedAccount)
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
    async getAccountsByChatId(chatId: number): Promise<{id: string, account: string, chatId: string}[]> {
      return strapi.entityService.findMany(
        MODULE_ID,
        {
          filters: { chatId },
          fields: ['id', 'account', 'chatId']
        }
      )
    },
  }
});
