# Telegram Bot Link Endpoints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two internal, bot-authenticated write endpoints to the `telegram-subscription` API so bff can link/unlink a Telegram subscription without the browser-side widget hash.

**Architecture:** Two new controller actions (`linkViaBot`, `unlinkViaBot`) on the existing `api::telegram-subscription.telegram-subscription` module, backed by two new service methods, exposed via two new custom routes. No content-type/schema change — `hash`, `authDate`, `photoUrl` are already optional columns.

**Tech Stack:** Strapi v4 custom routes/controllers/services (TypeScript).

**Spec:** `/Users/shoom/IdeaProjects/cowswap/docs/superpowers/specs/2026-08-18-telegram-bot-deeplink-notifications-design.md` (section "1. `cms`")

## Global Constraints

- The two new routes must NOT be granted to the Strapi "Public" role — only the bff API token should be able to call them. This is an admin-panel step (see Task 3), not something expressible in code/git.
- This repo has no jest/test infrastructure for the `telegram-subscription` module (or anywhere else under `src/api`) today. Per "follow existing patterns," this plan does **not** introduce one — verification steps are manual (`strapi develop` + `curl`) instead of automated tests, unlike the bff/frontend plans for this same feature.
- Keep using `strapi.entityService` exactly as the existing `addSubscription`/`removeSubscriptions` methods do — don't introduce a new data-access style for these two methods.

---

### Task 1: Service methods `linkSubscriptionViaBot` / `unlinkSubscriptionViaBot`

**Files:**
- Modify: `src/api/telegram-subscription/services/telegram-subscription.ts`

**Interfaces:**
- Produces: `service.linkSubscriptionViaBot(account: string, telegram: { chatId: number; firstName?: string; username?: string }): Promise<unknown>` and `service.unlinkSubscriptionViaBot(account: string): Promise<boolean>`, both on `strapi.service('api::telegram-subscription.telegram-subscription')`.
- Consumes: existing `this.getAccountSubscriptions(account)` and `this.removeSubscriptions(account)` on the same service object (both already defined below in this file).

- [ ] **Step 1: Add the two methods to the service**

Open `src/api/telegram-subscription/services/telegram-subscription.ts`. Add these two methods inside the object returned by `factories.createCoreService(MODULE_ID, ({strapi}) => { return { ... } })`, next to the existing `addSubscription`/`removeSubscriptions` methods:

```ts
    async linkSubscriptionViaBot(
      account: string,
      telegram: { chatId: number; firstName?: string; username?: string }
    ) {
      const existing = await this.getAccountSubscriptions(account)

      if (existing.length > 0) {
        // Already linked (e.g. user tapped /start twice) — idempotent no-op
        return existing[0]
      }

      return strapi.entityService.create(
        MODULE_ID,
        {
          data: {
            account: account.toLowerCase(),
            chatId: telegram.chatId,
            firstName: telegram.firstName,
            username: telegram.username,
          }
        })
    },
    async unlinkSubscriptionViaBot(account: string) {
      return this.removeSubscriptions(account)
    },
```

Place them directly after the existing `removeSubscriptions` method (so `this.getAccountSubscriptions`/`this.removeSubscriptions` read naturally as "defined above").

- [ ] **Step 2: Manually verify via the Strapi console**

Run: `yarn develop` (or `npm run develop`, whichever this repo's README documents) from the `cms` repo root, then open the Strapi admin's "Content Manager" for "Telegram subscription" in a second tab so you can watch rows appear.

In a third terminal, open a Node REPL against the running app is overkill — instead, temporarily call the new service method from the Strapi admin's own "Content-Type Builder > ... > Test" isn't available for services, so verification for this task happens via Task 3's route-level curl check instead. Skip standalone verification here; proceed to Task 2.

- [ ] **Step 3: Commit**

```bash
git add src/api/telegram-subscription/services/telegram-subscription.ts
git commit -m "feat(telegram-subscription): add linkSubscriptionViaBot/unlinkSubscriptionViaBot service methods"
```

---

### Task 2: Controller actions `linkViaBot` / `unlinkViaBot`

**Files:**
- Modify: `src/api/telegram-subscription/controllers/telegram-subscription.ts`

**Interfaces:**
- Consumes: `service.linkSubscriptionViaBot`, `service.unlinkSubscriptionViaBot` from Task 1.
- Produces: `controller.linkViaBot(context)` and `controller.unlinkViaBot(context)`, each reading `context.request.body` and returning `{ success: true }`, matching the `(context) => Promise<unknown>` shape Strapi expects for a custom route handler.

- [ ] **Step 1: Add the two controller actions**

Open `src/api/telegram-subscription/controllers/telegram-subscription.ts`. Add these two actions inside the object returned by `factories.createCoreController(MODULE_ID, ({strapi}) => { return { ... } })`, after the existing `sendNotifications` action:

```ts
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
```

Note `errors` is already imported at the top of this file (`import { errors } from '@strapi/utils'`) — no new import needed.

- [ ] **Step 2: Commit**

```bash
git add src/api/telegram-subscription/controllers/telegram-subscription.ts
git commit -m "feat(telegram-subscription): add linkViaBot/unlinkViaBot controller actions"
```

---

### Task 3: Routes, manual verification, and the Public-role exclusion

**Files:**
- Modify: `src/api/telegram-subscription/routes/telegram-subscription.ts`

**Interfaces:**
- Consumes: `telegram-subscription.linkViaBot`, `telegram-subscription.unlinkViaBot` handlers from Task 2.
- Produces: `POST /telegram-subscription/link-via-bot` and `POST /telegram-subscription/unlink-via-bot`, which is what the bff plan's `PushSubscriptionsRepositoryCms` calls.

- [ ] **Step 1: Add the two routes**

Open `src/api/telegram-subscription/routes/telegram-subscription.ts`. Add two entries to the `myExtraRoutes` array, after the existing `/send-tg-notifications` entry:

```ts
  {
    method: 'POST',
    path: '/telegram-subscription/link-via-bot',
    handler: 'telegram-subscription.linkViaBot',
    config: {
      policies: [],
      middlewares: [],
    },
  },
  {
    method: 'POST',
    path: '/telegram-subscription/unlink-via-bot',
    handler: 'telegram-subscription.unlinkViaBot',
    config: {
      policies: [],
      middlewares: [],
    },
  },
```

- [ ] **Step 2: Start Strapi locally**

Run: `yarn develop` from the `cms` repo root. Wait for it to log the admin URL (typically `http://localhost:1337/admin`).

- [ ] **Step 3: In the Strapi admin, confirm the new routes are NOT public**

Go to Settings → Users & Permissions Plugin → Roles → Public. Confirm `Telegram-subscription` → `linkViaBot` and `unlinkViaBot` are **unchecked** (they should be, since Strapi doesn't auto-grant new custom routes to any role — but verify explicitly, since a prior seed/import could have granted "select all"). If they are checked, uncheck and save.

- [ ] **Step 4: Grant the bff API token access**

Go to Settings → API Tokens, open the token bff already uses (the one behind `CMS_API_KEY` in the bff deployment). Under its permissions, enable `Telegram-subscription` → `linkViaBot` and `unlinkViaBot`. Save.

- [ ] **Step 5: Manually verify with curl**

Replace `<CMS_API_KEY>` with the same token from Step 4 (find its raw value in whatever secrets store bff's deployment reads `CMS_API_KEY` from — the Strapi admin only shows tokens once, at creation time).

```bash
curl -i -X POST http://localhost:1337/api/telegram-subscription/link-via-bot \
  -H "Authorization: Bearer <CMS_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"account":"0x1111111111111111111111111111111111111111","chatId":123456,"firstName":"Test","username":"testuser"}'
```

Expected: `HTTP/1.1 200 OK` with body `{"success":true}`. Confirm the row appears in Content Manager → Telegram subscription with `account` lowercased and `chatId` set.

Then verify unlink:

```bash
curl -i -X POST http://localhost:1337/api/telegram-subscription/unlink-via-bot \
  -H "Authorization: Bearer <CMS_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"account":"0x1111111111111111111111111111111111111111"}'
```

Expected: `HTTP/1.1 200 OK` with body `{"success":true}`, and the row is gone from Content Manager.

Also verify the routes reject unauthenticated calls (no `Authorization` header):

```bash
curl -i -X POST http://localhost:1337/api/telegram-subscription/link-via-bot \
  -H "Content-Type: application/json" \
  -d '{"account":"0x1111111111111111111111111111111111111111","chatId":123456}'
```

Expected: `HTTP/1.1 401 Unauthorized` (or `403 Forbidden`, depending on Strapi's default for an unrecognized role on a non-public route) — **not** `200`.

- [ ] **Step 6: Commit**

```bash
git add src/api/telegram-subscription/routes/telegram-subscription.ts
git commit -m "feat(telegram-subscription): add link-via-bot/unlink-via-bot routes"
```
