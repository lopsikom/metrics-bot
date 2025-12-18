import actionHandler from "@botModels/actionHandler";
import prisma from "@prisma/prismaClient";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import { Markup } from "telegraf";

const serverTaskDeleteAction : actionHandler = {
    trigger : /SERVER_TASK_DELETE_*/,
    handler : async (ctx) => {
        const serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const tasks = await prisma.getAllTasksByServer(serverId)
        console.log(tasks)
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
}
export default serverTaskDeleteAction