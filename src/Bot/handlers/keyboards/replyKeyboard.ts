import inlineKeyboardEvent from "@botModels/keyboards/inlineEnum";
import ReplyKeyboardEvents from "@botModels/keyboards/replyEnum";
import prisma from "@prisma/prismaClient";
import handlersCollector from "Bot/services/handlersCollector";
import { Markup } from "telegraf";

handlersCollector.addHandlers({
    type : 'replyKeyboard',
    trigger : ReplyKeyboardEvents.ACCOUNT,
    handler : async (ctx) =>{
        const name = ctx.from?.first_name
        const id = ctx.from?.id
        const serversCount = await prisma.getServersCountUser(ctx.user?.id ?? '')
        const premium = ctx.from?.is_premium ? "Премиум аккаунт" : "Обычный аккаунт"
        ctx.reply(`Имя: ${name}\n
        ID: ${id}\n
        Тип аккаунта: ${premium}\n
        Количество серверов ${serversCount}`)
    }
},
{
    type : 'replyKeyboard',
    trigger : ReplyKeyboardEvents.HELP,
    handler : (ctx) => {
        ctx.reply('Помощь и Поддержка:\nВыберите вопрос или проблему', Markup.inlineKeyboard([[Markup.button.callback('Как начать работу?', inlineKeyboardEvent.HOW_TO_START)]]))
    }
},
{
    type : 'replyKeyboard',
    trigger : ReplyKeyboardEvents.SERVERS,
    handler : async (ctx) => {
        const servers = await prisma.getUserServers(ctx.user?.id ?? '')
        if(servers.length > 0){
            ctx.reply(`Общее количество серверов: ${servers.length}\n${servers.map(h => `${h.name}:${h.host}`).join("\n")}`,
        Markup.inlineKeyboard([...servers.map(s => [Markup.button.callback(`${s.name}`, `SELECT_SERVER_${s.id}`)]), 
        [Markup.button.callback('Добавить сервер', inlineKeyboardEvent.ADD_SERVER)]]))
        
        }
        else{
            ctx.reply("Подключенных серверов нету",Markup.inlineKeyboard([[Markup.button.callback('Добавить сервер', inlineKeyboardEvent.ADD_SERVER)]]))
        }
    }
}
)