import { Keyboard } from "@maxhub/max-bot-api"
import { getServerCountUser, getServersPrisma, checkConfig } from "../utils/utils"
import type { UserPrisma } from "@bot/shared"

type Reply = (text: string, options?: { attachments?: any[] }) => Promise<any>

export function getMainMenuKeyboard() {
    return Keyboard.inlineKeyboard([
        [Keyboard.button.callback("Сервера", "menu_servers"), Keyboard.button.callback("Аккаунт", "menu_account")],
        [Keyboard.button.callback("О нас", "menu_about"), Keyboard.button.callback("Помощь", "menu_help")]
    ])
}

export async function viewMainMenu(reply: Reply) {
    await reply("Главное меню", { attachments: [getMainMenuKeyboard()] })
}

export async function viewServers(reply: Reply, user: UserPrisma) {
    await checkConfig(user.id, user.first_name)
    const servers = await getServersPrisma(user.id)
    if (servers.length > 0) {
        const keyboard = Keyboard.inlineKeyboard([
            ...servers.map(s => [Keyboard.button.callback(`${s.name}`, `SELECT_SERVER_${s.id}`)]),
            [Keyboard.button.callback("Добавить сервер", "add_server")]
        ])
        await reply(
            `Общее количество серверов: ${servers.length}\n${servers.map(h => `${h.name}:${h.host}`).join("\n")}`,
            { attachments: [keyboard] }
        )
    } else {
        const keyboard = Keyboard.inlineKeyboard([
            [Keyboard.button.callback("Добавить сервер", "add_server")]
        ])
        await reply("Подключенных серверов нету", { attachments: [keyboard] })
    }
}

export async function viewAccount(reply: Reply, user: UserPrisma, displayName: string, userId: number) {
    const serversCount = await getServerCountUser(user.id)
    await reply(
        `Имя: ${displayName}\nID: ${userId}\nКоличество серверов: ${serversCount}`,
        { attachments: [getMainMenuKeyboard()] }
    )
}

export async function viewHelp(reply: Reply) {
    const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback("Как начать работу?", "how_to_start")],
        [Keyboard.button.callback("Назад в меню", "back_to_menu")]
    ])
    await reply("Помощь и Поддержка:\nВыберите вопрос или проблему", { attachments: [keyboard] })
}

export async function viewAbout(reply: Reply) {
    const keyboard = Keyboard.inlineKeyboard([
        [Keyboard.button.callback("Назад в меню", "back_to_menu")]
    ])
    await reply("Бот для мониторинга серверов через Prometheus.\nОтслеживайте метрики CPU, RAM, Disk и сети прямо в мессенджере.", { attachments: [keyboard] })
}
