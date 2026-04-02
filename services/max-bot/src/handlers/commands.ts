import { type Bot } from "@maxhub/max-bot-api"
import { resolveUser } from "../middleware/userMiddleware"
import { viewMainMenu, viewServers, viewAccount, viewHelp, viewAbout } from "./views"

export function registerCommands(bot: Bot) {
    bot.command("menu", async (ctx) => {
        const userId = ctx.message?.sender?.user_id
        if (!userId) return
        await resolveUser(userId, ctx.message?.sender?.name ?? "User", undefined, ctx.message?.sender?.username ?? undefined)
        await viewMainMenu(ctx.reply.bind(ctx))
    })

    bot.command("servers", async (ctx) => {
        const userId = ctx.message?.sender?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.message?.sender?.name ?? "User", undefined, ctx.message?.sender?.username ?? undefined)
        if (!user) return
        await viewServers(ctx.reply.bind(ctx), user)
    })

    bot.command("account", async (ctx) => {
        const userId = ctx.message?.sender?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.message?.sender?.name ?? "User", undefined, ctx.message?.sender?.username ?? undefined)
        if (!user) return
        await viewAccount(ctx.reply.bind(ctx), user, ctx.message?.sender?.name ?? "User", userId)
    })

    bot.command("help", async (ctx) => {
        await viewHelp(ctx.reply.bind(ctx))
    })

    bot.command("about", async (ctx) => {
        await viewAbout(ctx.reply.bind(ctx))
    })
}
