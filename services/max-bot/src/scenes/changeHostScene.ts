import type { Bot } from "@maxhub/max-bot-api"
import sceneManager from "./sceneManager"
import type { SceneDefinition } from "./sceneManager"
import { changeDataServer, changeTargetConfig, getServerPrisma } from "../utils/utils"
import { resolveUser } from "../middleware/userMiddleware"

export function registerChangeHostScene(bot: Bot) {
    const scene: SceneDefinition = {
        name: "server_change_host",
        steps: [
            async (userId, _text, _state) => {
                await bot.api.sendMessageToUser(userId, "Введите новый адрес сервера")
            },
            async (userId, text, state) => {
                state.data.newHost = text
                const server = await getServerPrisma(state.data.server_id)
                if (!server) {
                    await bot.api.sendMessageToUser(userId, "Сервер не найден")
                    sceneManager.leave(userId)
                    return
                }
                await changeDataServer(state.data.server_id, { host: state.data.newHost })
                await bot.api.sendMessageToUser(userId, "Адрес сервера изменён")
                const user = await resolveUser(userId, "")
                if (user) {
                    await changeTargetConfig(user.first_name, server.host, state.data.newHost)
                }
                sceneManager.leave(userId)
            }
        ]
    }
    sceneManager.registerScene(scene)
}
