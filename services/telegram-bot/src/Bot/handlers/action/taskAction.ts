import { croneTime } from "@bot/shared/src/events/crone/crone";
import ScenesEnum from "src/Bot/models/Scenes/scenesEnum";
import handlersCollector from "src/Bot/services/handlersCollector";
import getDataFromRegEx from "src/Bot/utils/getDataFromRegEx";
import { getAllTasksByServer, unEmitTask } from "src/Bot/utils/utils";
import { Markup } from "telegraf";

handlersCollector.addHandlers({
        type : "action",
        trigger : /SERVER_TASK_DELETE_*/,
            handler : async (ctx) => {
                const serverId = getDataFromRegEx(ctx)
                if(!serverId) return
                const tasks = await getAllTasksByServer(serverId)
                if(tasks.length < 0){
                    await ctx.reply('Уведомлений для удаления нету')
                    await ctx.reply(`Уведомления не зарегистрированы`,
                            Markup.inlineKeyboard([[Markup.button.callback("Установить новое уведомление", `SERVER_TASK_EMIT_${JSON.stringify(tasks)}`)],[Markup.button.callback("Удалить уведомление", `SERVER_TASK_DELETE_${serverId}`)]])
                    )
                    return
                }
                await ctx.reply("Выберите уведомление для удаления:",
                    Markup.inlineKeyboard([...tasks.map(t => Markup.button.callback(`${t.name.split('_')[2]}`, `TASK_DELETE_${t.id}`))])
                )
            }
    },
    {
        type : "action",
        trigger : /SERVER_TASK_EMIT_*/,
        handler : async(ctx) => {
            const serverId = getDataFromRegEx(ctx)
            ctx.answerCbQuery()
            if(!serverId) return
            ctx.scene.enter(ScenesEnum.SERVER_TASK_EMIT, {serverId})
        
            }
    },
    {
        type : "action",
        trigger : /SERVER_TASK_MENU_*/,
        handler : async (ctx) =>{
            const serverId = getDataFromRegEx(ctx)
            if(!serverId) return
            const tasks = await getAllTasksByServer(serverId)
            let tasksString = ""
            tasks.forEach(t => {
                const name = t.name.split('_')[2]
                const interval = croneTime[t.interval]
                tasksString += `\n${name}: ${interval}`
            })
            ctx.reply(`${tasks.length > 0 ? `Общее количество уведомлений: ${tasks.length}` : 'Уведомление не зарегистрированны'}${tasksString}`,
                Markup.inlineKeyboard([[Markup.button.callback("Установить новое уведомление", `SERVER_TASK_EMIT_${serverId}`)],[Markup.button.callback("Удалить уведомление", `SERVER_TASK_DELETE_${serverId}`)]])
            )
        }
    },
    {
        type : "action",
        trigger: /TASK_DELETE_*/,
        handler : async (ctx) => {
            const taskId = getDataFromRegEx(ctx)
            if(!taskId) return
            const result = await unEmitTask(taskId)
            if(result) ctx.reply("Уведомление удаленно")
            else ctx.reply("Не удалось удалить уведомление")
            ctx.answerCbQuery()

        }
    }
)