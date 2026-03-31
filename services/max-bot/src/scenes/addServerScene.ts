import type { Bot } from "@maxhub/max-bot-api"
import sceneManager from "./sceneManager"
import type { SceneDefinition } from "./sceneManager"
import { addServerPrisma, addTargetConfig } from "../utils/utils"
import { resolveUser } from "../middleware/userMiddleware"

export function registerAddServerScene(bot: Bot) {
    const scene: SceneDefinition = {
        name: "add_server",
        steps: [
            async (userId, _text, _state) => {
                await bot.api.sendMessageToUser(userId, "Введите название сервера")
            },
            async (userId, text, state) => {
                state.data.name = text
                await bot.api.sendMessageToUser(userId, "Введите адрес сервера с портом при наличии")
            },
            async (userId, text, state) => {
                state.data.server_ip = text
                const user = await resolveUser(userId, "")
                if (user) {
                    addServerPrisma(user.id, state.data.name, state.data.server_ip)
                    addTargetConfig(state.data.server_ip, user.first_name)
                }
                await bot.api.sendMessageToUser(userId, `${state.data.name} по адресу ${state.data.server_ip} успешно зарегистрирован`)
                sceneManager.leave(userId)
            }
        ]
    }
    sceneManager.registerScene(scene)
}
