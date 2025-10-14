import { Context } from "telegraf";
import ReplyKeyboardEvents from "../../../models/keyboards/replyEnum";
import ReplyKeyboardHandler from "../../../models/keyboards/keyboardHandler";

const accountHandler : ReplyKeyboardHandler = {
    title : ReplyKeyboardEvents.ACCOUNT,
    handler : (ctx : Context) =>{
        const name = ctx.from?.first_name
        const id = ctx.from?.id
        const premium = ctx.from?.is_premium ? "Премиум аккаунт" : "Обычный аккаунт"
        ctx.reply(`Имя: ${name}\n
ID: ${id}\n
Тип аккаунта: ${premium}`)
    }
}
export default accountHandler