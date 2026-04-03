
import inlineKeyboardEvent from "src/Bot/models/keyboards/inlineEnum";
import ReplyKeyboardEvents from "src/Bot/models/keyboards/replyEnum";
import handlersCollector from "src/Bot/services/handlersCollector";
import { getServerCountUser, getServersPrisma } from "src/Bot/utils/utils";
import { Markup } from "telegraf";

handlersCollector.addHandlers({
    type : 'replyKeyboard',
    trigger : ReplyKeyboardEvents.ACCOUNT,
    handler : async (ctx) =>{
        const name = ctx.from?.first_name
        const id = ctx.from?.id
        const serversCount = await getServerCountUser(ctx.user?.id ?? '')
        const premium = ctx.from?.is_premium ? "Премиум аккаунт" : "Обычный аккаунт"
        const linked = ctx.user?.max_id ? "Max: привязан" : "Max: не привязан"
        ctx.reply(`Имя: ${name}\nTelegram ID: ${id}\nТип аккаунта: ${premium}\nКоличество серверов: ${serversCount}\n${linked}`)
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
        const servers = await getServersPrisma(ctx.user?.id ?? '')
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