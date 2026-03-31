import { Keyboard, type Bot } from "@maxhub/max-bot-api"

export function registerStartHandler(bot: Bot) {
    bot.command("start", async (ctx) => {
        const name = ctx.message?.sender?.name ?? "друг"
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Начать", "start")]
        ])
        await ctx.reply(`Привет ${name}`, { attachments: [keyboard] })
    })
}
