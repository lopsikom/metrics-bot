import WizardUserContext from "@botModels/userContext";
import { Telegraf } from "telegraf";

export const setHello = (bot : Telegraf<WizardUserContext>) =>{
    bot.on('text', (ctx) => ctx.reply(ctx.message.text))
}
