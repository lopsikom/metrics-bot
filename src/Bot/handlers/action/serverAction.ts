import actionHandler from "@botModels/actionHandler";
import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import prisma from "@prisma/prismaClient";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import { Markup } from "telegraf";


const serverAction : actionHandler = { //Пофиксить типы
    trigger : /SELECT_SERVER_*/,
    handler : async (ctx) => {
        const serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const server = await prisma.getServer(serverId)
        if(!server) ctx.reply("Сервер не найден")
        console.log(server)
        ctx.reply(`Сервер: ${server?.name}\nАдрес: ${server?.host}\nПуть: ${server?.endpoint}`,
           Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", inlineKeyboardEvent.METRICS_SERVER)], [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server?.id}`)]]) 
        )

    }

}
export default serverAction