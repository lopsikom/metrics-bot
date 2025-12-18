import actionHandler from "@botModels/actionHandler";
import croneTime from "@botModels/crone/croneTime";
import prisma from "@prisma/prismaClient";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import { Markup } from "telegraf";

const serverTasksInfo : actionHandler = {
    trigger : /SERVER_TASK_MENU_*/,
    handler : async (ctx) =>{
        const serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const tasks = await prisma.getAllTasksByServer(serverId)
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
}

export default serverTasksInfo