import { userContext } from "@botModels/userContext";
import getDataFromRegEx from "./getDataFromRegEx";
import prisma from "@prisma/prismaClient";
import prometheusAPI from "@prometheus/prometheusAPI";
import { Markup } from "telegraf";

async function showServer(ctx : userContext, id? : string) {
        console.log("SSSPERMA")
        let serverId
        if(id) serverId = id
        else serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const server = await prisma.getServer(serverId)
        if(!server){ 
            ctx.reply("Сервер не найден")
            await ctx.answerCbQuery()
            return
        }
        const params = Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`),
            Markup.button.callback("Устанановить рассылку", `SERVER_TASK_EMIT_${server.id}`)
        ], 
        [Markup.button.callback("Изменить данные", `SERVER_CHANGE_INFO_${server.id}`)],
        [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)]])
        try{
        const isUp = await prometheusAPI.checkUpServer(server.host)
        let infoServer
        if(isUp) infoServer = await prometheusAPI.getServerInfo(server.host)
        ctx.reply(`${isUp ? `🟢 Сервер '${server.name}' доступен\nОС: ${infoServer?.os}\nАрхитектура: ${infoServer?.machine}\nNodeName: ${infoServer?.nodename}` : `🔴 Сервер '${server.name}' недоступен`}\nАдрес: ${server.host}`,
          params ) 
        }catch(e){
            console.log(e)
            ctx.reply(`🔴 Сервер '${server.name}' недоступен\nАдрес: ${server.host}`,
                params
            )
        }
}

export default showServer