import { Telegraf } from "telegraf";
import { Markup } from "telegraf";
import inlineKeyboardEvent from "../models/keyboards/inlineEnum";

const setStart = (bot : Telegraf) => {
        bot.start((cxt) =>{
        const name = cxt.from.first_name ?? 'друг'
        cxt.reply(`Привет ${name}`, Markup.inlineKeyboard([[Markup.button.callback('Начать', inlineKeyboardEvent.START)]]))
    })
}
export default setStart