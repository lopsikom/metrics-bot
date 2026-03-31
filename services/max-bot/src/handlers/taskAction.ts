import { Keyboard, type Bot } from "@maxhub/max-bot-api"
import { croneTime } from "@bot/shared/src/events/crone/crone"
import { getAllTasksByServer, unEmitTask } from "../utils/utils"
import sceneManager from "../scenes/sceneManager"

export function registerTaskActions(bot: Bot) {
    bot.action(/SERVER_TASK_MENU_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        if (!serverId) return
        const tasks = await getAllTasksByServer(serverId)
        let tasksString = ""
        tasks.forEach(t => {
            const name = t.name.split("_")[2]
            const interval = croneTime[t.interval]
            tasksString += `\n${name}: ${interval}`
        })
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Установить новое уведомление", `SERVER_TASK_EMIT_${serverId}`)],
            [Keyboard.button.callback("Удалить уведомление", `SERVER_TASK_DELETE_${serverId}`)]
        ])
        await ctx.reply(
            `${tasks.length > 0 ? `Общее количество уведомлений: ${tasks.length}` : "Уведомления не зарегистрированы"}${tasksString}`,
            { attachments: [keyboard] }
        )
    })

    bot.action(/SERVER_TASK_EMIT_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        const userId = ctx.user?.user_id
        if (!userId || !serverId) return
        sceneManager.enter(userId, "server_task_emit", { serverId })
    })

    bot.action(/SERVER_TASK_DELETE_(.+)/, async (ctx) => {
        const serverId = ctx.match![1]
        if (!serverId) return
        const tasks = await getAllTasksByServer(serverId)
        if (tasks.length <= 0) {
            await ctx.reply("Уведомлений для удаления нету")
            return
        }
        const keyboard = Keyboard.inlineKeyboard(
            tasks.map(t => [Keyboard.button.callback(`${t.name.split("_")[2]}`, `TASK_DELETE_${t.id}`)])
        )
        await ctx.reply("Выберите уведомление для удаления:", { attachments: [keyboard] })
    })

    bot.action(/TASK_DELETE_(.+)/, async (ctx) => {
        const taskId = ctx.match![1]
        if (!taskId) return
        const result = await unEmitTask(taskId)
        if (result) await ctx.reply("Уведомление удалено")
        else await ctx.reply("Не удалось удалить уведомление")
    })
}
