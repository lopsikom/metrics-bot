import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import KeyboardHandler from "@botModels/keyboards/keyboardHandler";
import ReplyKeyboardEvents from "@botModels/keyboards/replyEnum";
import prisma from "@prisma/prismaClient";
import { Markup } from "telegraf";

const serverHandler : KeyboardHandler = {
    title : ReplyKeyboardEvents.SERVERS,
    handler : async (ctx) => {
        const servers = await prisma.getUserServers(ctx.user?.id ?? '')
        if(servers.length > 0){
            ctx.reply(`Общее количество серверов: ${servers.length}\n${servers.map(h => `${h.name}:${h.host}`).join("\n")}`,
        Markup.inlineKeyboard([[Markup.button.callback('Добавить сервер', inlineKeyboardEvent.ADD_SERVER)], [Markup.button.callback('Удалить сервер',inlineKeyboardEvent.DELETE_SERVER)]]))
        }
        else{
            ctx.reply("Подключенных серверов нету",Markup.inlineKeyboard([[Markup.button.callback('Добавить сервер', inlineKeyboardEvent.ADD_SERVER)]]))
        }
    }
}
export default serverHandler