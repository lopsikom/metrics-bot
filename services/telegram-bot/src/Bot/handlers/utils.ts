
import { Telegraf } from "telegraf";
import WizardUserContext from "../models/userContext";

export const setHello = (bot : Telegraf<WizardUserContext>) =>{
    bot.on('text', (ctx) => ctx.reply(ctx.message.text))
}
