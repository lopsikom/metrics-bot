import { Keyboard, type Bot } from "@maxhub/max-bot-api"
import sceneManager from "./sceneManager"
import type { SceneDefinition } from "./sceneManager"
import { emitTask, getServerPrisma } from "../utils/utils"
import { resolveUser } from "../middleware/userMiddleware"

export function registerTaskEmitScene(bot: Bot) {
    const scene: SceneDefinition = {
        name: "server_task_emit",
        steps: [
            async (userId, _text, _state) => {
                await bot.api.sendMessageToUser(userId, "Введите название для уведомления")
            },
            async (userId, text, state) => {
                state.data.name = text
                const keyboard = Keyboard.inlineKeyboard([
                    [Keyboard.button.callback("1 минута", "TIME_* * * * *"), Keyboard.button.callback("10 минут", "TIME_*/10 * * * *")],
                    [Keyboard.button.callback("Каждый час", "TIME_0 * * * *"), Keyboard.button.callback("Каждый день", "TIME_0 9 * * *")]
                ])
                await bot.api.sendMessageToUser(userId, "Выберите промежутки времени", { attachments: [keyboard] })
            }
        ]
    }
    sceneManager.registerScene(scene)

    bot.action(/TIME_(.+)/, async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return

        const state = sceneManager.getState(userId)
        if (!state || state.scene !== "server_task_emit") return

        const interval = ctx.match![1]
        state.data.interval = interval

        const server = await getServerPrisma(state.data.serverId)
        if (!server) {
            await ctx.reply("Сервер не найден")
            sceneManager.leave(userId)
            return
        }

        const prismaUser = await resolveUser(userId, ctx.user!.name ?? "User")
        const telegramChatId = prismaUser?.telegram_id ?? undefined
        await emitTask(server.host, server.id, ctx.user!.name!, state.data.interval, userId.toString(), state.data.name, telegramChatId)
        await ctx.reply("Уведомление зарегистрировано")
        sceneManager.leave(userId)
    })
}
