import type { Bot } from "@maxhub/max-bot-api"
import sceneManager from "./sceneManager"
import { linkAccount } from "../utils/utils"
import { invalidateUserCache } from "../middleware/userMiddleware"

export function registerLinkAccountScene(bot: Bot) {
    sceneManager.registerScene({
        name: "link_account",
        steps: [
            async (userId, _text, _state) => {
                await bot.api.sendMessageToUser(userId, "Введите ваш Telegram ID.\nУзнать его можно в разделе «Аккаунт» Telegram бота.")
            },
            async (userId, text, _state) => {
                const telegramId = text.trim()
                if (!telegramId || !/^\d+$/.test(telegramId)) {
                    await bot.api.sendMessageToUser(userId, "Некорректный ID. Telegram ID должен быть числом. Попробуйте /start заново.")
                    sceneManager.leave(userId)
                    return
                }

                const result = await linkAccount(userId.toString(), telegramId)
                if (result.success) {
                    invalidateUserCache(userId)
                    await bot.api.sendMessageToUser(userId, "Аккаунт успешно привязан к Telegram!")
                } else {
                    await bot.api.sendMessageToUser(userId, `Не удалось привязать: ${result.error}`)
                }
                sceneManager.leave(userId)
            }
        ]
    })
}
