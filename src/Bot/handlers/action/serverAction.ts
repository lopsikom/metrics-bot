import actionHandler from "@botModels/actionHandler";
import prisma from "@prisma/prismaClient";
import prometheusAPI from "@prometheus/prometheusAPI";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import { Markup } from "telegraf";


const serverAction : actionHandler = { //Пофиксить типы
    trigger : /SELECT_SERVER_*/,
    handler : async (ctx) => {
        const serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const server = await prisma.getServer(serverId)
        if(!server){ 
            ctx.reply("Сервер не найден")
            return
        }
        console.log(server)
        const isUp = await prometheusAPI.checkUpServer(server.host)
        ctx.reply(`${isUp ? `🟢 Сервер ${server.name} доступен` : `🔴 Сервер ${server.name} недоступен`}\nАдрес: ${server.host}\nПуть: ${server.endpoint}`,
           Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`)], [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)]]) 
        )

    }

}
export default serverAction