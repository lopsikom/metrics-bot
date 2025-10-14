import { Telegraf } from "telegraf";

export const setHello = (bot : Telegraf) =>{
    bot.on('text', (ctx) => ctx.reply(ctx.message.text))
}
