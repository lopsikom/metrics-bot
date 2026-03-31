import { Keyboard, type Bot } from "@maxhub/max-bot-api"
import getDataFromPayload from "../utils/getDataFromPayload"
import showServer from "../utils/showServers"
import { checkConfig, deleteServer, getServerMetrics, getServerPrisma, removeTargeConfig } from "../utils/utils"
import { resolveUser } from "../middleware/userMiddleware"
import sceneManager from "../scenes/sceneManager"

export function registerServerActions(bot: Bot) {
    bot.action(/SELECT_SERVER_(.+)/, async (ctx) => {
        try {
            const userId = ctx.user?.user_id
            if (!userId) return
            const user = await resolveUser(userId, ctx.user?.name ?? "User")
            if (!user) return
            const result = await checkConfig(user.id, user.first_name)
            if (!result) {
                await ctx.reply("Произошла ошибка")
                return
            }
            const serverId = ctx.match![1]
            await showServer(ctx, serverId)
        } catch (e) {
            console.log(e)
            await ctx.reply(`Ошибка: ${e}`)
        }
    })

    bot.action(/SERVER_METRICS_(.+)/, async (ctx) => {
        try {
            const serverIp = ctx.match![1]
            if (!serverIp) return
            const metrics = await getServerMetrics(serverIp)
            await ctx.reply(
                `Метрики сервера ${serverIp}:\n\n` +
                `CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                `Количество процессов: ${metrics.fork.toFixed(1)}\n` +
                `RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                `Disk: ${(metrics.disk * 100).toFixed(1)}%\n` +
                `Входящий трафик: ${metrics.receiveNetwork.toFixed(1)} Мбит\n` +
                `Исходящий трафик: ${metrics.transmitNetwork.toFixed(1)} Мбит`
            )
        } catch (e) {
            console.log(e)
            await ctx.reply(`Ошибка: ${e}`)
        }
    })

    bot.action(/DELETE_SERVER_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        if (!serverId) return
        const userId = ctx.user?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.user?.name ?? "User")
        if (!user) return
        const server = await getServerPrisma(serverId)
        if (!server) return
        deleteServer(serverId)
        removeTargeConfig(server.host, user.first_name)
        await ctx.reply("Сервер удалён")
    })

    bot.action(/SERVER_CHANGE_INFO_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Название", `SERVER_CHANGE_NAME_${serverId}`)],
            [Keyboard.button.callback("Адрес", `SERVER_CHANGE_HOST_${serverId}`)],
            [Keyboard.button.callback("Назад", `SELECT_SERVER_${serverId}`)]
        ])
        await ctx.reply("Выберите что хотите изменить", { attachments: [keyboard] })
    })

    bot.action(/SERVER_CHANGE_NAME_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        const userId = ctx.user?.user_id
        if (!userId) return
        sceneManager.enter(userId, "server_change_name", { server_id: serverId })
    })

    bot.action(/SERVER_CHANGE_HOST_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        const userId = ctx.user?.user_id
        if (!userId) return
        sceneManager.enter(userId, "server_change_host", { server_id: serverId })
    })
}
