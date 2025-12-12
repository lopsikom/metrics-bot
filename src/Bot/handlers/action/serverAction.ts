import actionHandler from "@botModels/actionHandler";
import prisma from "@prisma/prismaClient";
import prometheusAPI from "@prometheus/prometheusAPI";
import prometheusConfig from "@prometheus/prometheusConfig";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import { Markup } from "telegraf";


const serverAction : actionHandler = { //Пофиксить типы
    trigger : /SELECT_SERVER_*/,
    handler : async (ctx) => {
        try{
        const result = await prometheusConfig.checkConfig(ctx)
        if(!result){
            ctx.reply("Произошла ошибка")
            await ctx.answerCbQuery()
            return
        }
        const serverId = getDataFromRegEx(ctx)
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
           Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`)], [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)]]) 
        )
        }catch(e){
            console.log(e)
            ctx.reply(`🔴 Сервер ${server.name} недоступен\nАдрес: ${server.host}`,
                Markup.inlineKeyboard([[Markup.button.callback("Метрики сервера", `SERVER_METRICS_${server.host}`)], [Markup.button.callback("Удалить сервер", `DELETE_SERVER_${server.id}`)]]
            ))
        }
        await ctx.answerCbQuery()
        }catch(e){
            console.log(e)
            ctx.reply(`Ошибка: ${e}`)
            await ctx.answerCbQuery()
        }

    }

}
export default serverAction