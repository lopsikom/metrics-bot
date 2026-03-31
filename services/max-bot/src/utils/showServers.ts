import { Keyboard } from "@maxhub/max-bot-api"
import { checkUpServerPrometheus, getServerInfoPrometheus, getServerPrisma } from "./utils"
import type { Context } from "@maxhub/max-bot-api"

export default async function showServer(ctx: Context, serverId: string) {
    if (!serverId) return
    const server = await getServerPrisma(serverId)
    if (!server) {
        await ctx.reply("Сервер не найден")
        return
    }
    const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`),
         Keyboard.button.callback("Уведомления", `SERVER_TASK_MENU_${server.id}`)],
        [Keyboard.button.callback("Изменить данные", `SERVER_CHANGE_INFO_${server.id}`)],
        [Keyboard.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)]
    ])
    try {
        const isUp = await checkUpServerPrometheus(server.host)
        let infoServer
        if (isUp) infoServer = await getServerInfoPrometheus(server.host)
        await ctx.reply(
            `${isUp ? `Сервер '${server.name}' доступен\nОС: ${infoServer?.os}\nАрхитектура: ${infoServer?.machine}\nNodeName: ${infoServer?.nodename}` : `Сервер '${server.name}' недоступен`}\nАдрес: ${server.host}`,
            { attachments: [keyboard] }
        )
    } catch (e) {
        console.log(e)
        await ctx.reply(
            `Сервер '${server.name}' недоступен\nАдрес: ${server.host}`,
            { attachments: [keyboard] }
        )
    }
}
