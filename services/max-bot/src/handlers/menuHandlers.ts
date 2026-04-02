import { type Bot } from "@maxhub/max-bot-api"
import { resolveUser } from "../middleware/userMiddleware"
import { viewMainMenu, viewServers, viewAccount, viewHelp, viewAbout } from "./views"

export function registerMenuHandlers(bot: Bot) {
    bot.action("start", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        await resolveUser(userId, ctx.user?.name ?? "User", undefined, ctx.user?.username ?? undefined)
        await viewMainMenu(ctx.reply.bind(ctx))
    })

    bot.action("menu_account", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.user?.name ?? "User")
        if (!user) return
        await viewAccount(ctx.reply.bind(ctx), user, ctx.user?.name ?? "User", userId)
    })

    bot.action("menu_servers", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.user?.name ?? "User")
        if (!user) return
        await viewServers(ctx.reply.bind(ctx), user)
    })

    bot.action("menu_help", async (ctx) => {
        await viewHelp(ctx.reply.bind(ctx))
    })

    bot.action("menu_about", async (ctx) => {
        await viewAbout(ctx.reply.bind(ctx))
    })

    bot.action("how_to_start", async (ctx) => {
        const { Keyboard } = await import("@maxhub/max-bot-api")
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Назад в меню", "back_to_menu")]
        ])
        await ctx.reply("Для начала требуется\nУказать адрес сервера\nОпрашиваемый эндпоинт с метриками", { attachments: [keyboard] })
    })

    bot.action("back_to_menu", async (ctx) => {
        await viewMainMenu(ctx.reply.bind(ctx))
    })

    bot.action("add_server", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        const sceneManager = (await import("../scenes/sceneManager")).default
        sceneManager.enter(userId, "add_server")
    })
}
