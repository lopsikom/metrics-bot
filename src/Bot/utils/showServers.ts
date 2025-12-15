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
        try{
        const isUp = await prometheusAPI.checkUpServer(server.host)
        ctx.reply(`${isUp ? `🟢 Сервер ${server.name} доступен` : `🔴 Сервер ${server.name} недоступен`}\nАдрес: ${server.host}`,
           Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`)], [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)],[Markup.button.callback("Изменить данные", `SERVER_CHANGE_INFO_${server.id}`)]]) 
        )
        }catch(e){
            console.log(e)
            ctx.reply(`🔴 Сервер ${server.name} недоступен\nАдрес: ${server.host}`,
                Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`)], [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)],[Markup.button.callback("Изменить данные", `SERVER_CHANGE_INFO_${server.id}`)]]
            ))
        }
}

export default showServer