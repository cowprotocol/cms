/**
 * telegram-subscription service
 */

import { factories } from '@strapi/strapi'

const MODULE_ID = 'api::telegram-subscription.telegram-subscription'

export default factories.createCoreService(MODULE_ID, ({strapi}) => {
  return {
    async linkSubscriptionViaBot(
      account: string,
      telegram: { chatId: number; firstName?: string; username?: string }
    ) {
      const normalizedAccount = account.toLowerCase()
      const existing = await this.getAccountSubscriptions(normalizedAccount)

      // One subscription per (account, chat). A different chat linking the same
      // account must ADD a row, never overwrite the chat already subscribed —
      // otherwise anyone can evict a victim's link and hijack its alerts.
      const alreadyLinked = existing.find(
        (subscription) => String(subscription.chatId) === String(telegram.chatId)
      )

      if (alreadyLinked) {
        // Already linked (e.g. user tapped /start twice) — idempotent no-op
        return alreadyLinked
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
    async unlinkSubscriptionViaBot(account: string, chatId: number) {
      const normalizedAccount = account.toLowerCase()
      const subscriptions = await this.getAccountSubscriptions(normalizedAccount)

      // Scope the delete to the calling chat so a subscriber can only remove its
      // own link, never wipe another chat subscribed to the same account.
      const owned = subscriptions.filter(
        (subscription) => String(subscription.chatId) === String(chatId)
      )

      for (const subscription of owned) {
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
