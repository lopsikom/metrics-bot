import { Keyboard, type Bot } from "@maxhub/max-bot-api"
import { resolveUser } from "../middleware/userMiddleware"
import { createNewUser, getServerCountUser, getServersPrisma } from "../utils/utils"

function getMainMenuKeyboard() {
    return Keyboard.inlineKeyboard([
        [Keyboard.button.callback("Сервера", "menu_servers"), Keyboard.button.callback("Аккаунт", "menu_account")],
        [Keyboard.button.callback("О нас", "menu_about"), Keyboard.button.callback("Помощь", "menu_help")]
    ])
}

export function registerMenuHandlers(bot: Bot) {
    bot.action("start", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        await resolveUser(userId, ctx.user?.name ?? "User", undefined, ctx.user?.username ?? undefined)
        const keyboard = getMainMenuKeyboard()
        await ctx.reply("Начало", { attachments: [keyboard] })
    })

    bot.action("menu_account", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.user?.name ?? "User")
        if (!user) return
        const name = ctx.user?.name
        const serversCount = await getServerCountUser(user.id)
        const keyboard = getMainMenuKeyboard()
        await ctx.reply(
            `Имя: ${name}\nID: ${userId}\nКоличество серверов: ${serversCount}`,
            { attachments: [keyboard] }
        )
    })

    bot.action("menu_servers", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        const user = await resolveUser(userId, ctx.user?.name ?? "User")
        if (!user) return
        const servers = await getServersPrisma(user.id)
        if (servers.length > 0) {
            const keyboard = Keyboard.inlineKeyboard([
                ...servers.map(s => [Keyboard.button.callback(`${s.name}`, `SELECT_SERVER_${s.id}`)]),
                [Keyboard.button.callback("Добавить сервер", "add_server")]
            ])
            await ctx.reply(
                `Общее количество серверов: ${servers.length}\n${servers.map(h => `${h.name}:${h.host}`).join("\n")}`,
                { attachments: [keyboard] }
            )
        } else {
            const keyboard = Keyboard.inlineKeyboard([
                [Keyboard.button.callback("Добавить сервер", "add_server")]
            ])
            await ctx.reply("Подключенных серверов нету", { attachments: [keyboard] })
        }
    })

    bot.action("menu_help", async (ctx) => {
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Как начать работу?", "how_to_start")],
            [Keyboard.button.callback("Назад в меню", "back_to_menu")]
        ])
        await ctx.reply("Помощь и Поддержка:\nВыберите вопрос или проблему", { attachments: [keyboard] })
    })

    bot.action("menu_about", async (ctx) => {
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Назад в меню", "back_to_menu")]
        ])
        await ctx.reply("Бот для мониторинга серверов через Prometheus.\nОтслеживайте метрики CPU, RAM, Disk и сети прямо в мессенджере.", { attachments: [keyboard] })
    })

    bot.action("how_to_start", async (ctx) => {
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Назад в меню", "back_to_menu")]
        ])
        await ctx.reply("Для начала требуется\nУказать адрес сервера\nОпрашиваемый эндпоинт с метриками", { attachments: [keyboard] })
    })

    bot.action("back_to_menu", async (ctx) => {
        const keyboard = getMainMenuKeyboard()
        await ctx.reply("Главное меню", { attachments: [keyboard] })
    })

    bot.action("add_server", async (ctx) => {
        const userId = ctx.user?.user_id
        if (!userId) return
        const sceneManager = (await import("../scenes/sceneManager")).default
        sceneManager.enter(userId, "add_server")
    })
}
