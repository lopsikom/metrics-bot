import type { Bot } from "@maxhub/max-bot-api"
import sceneManager from "./sceneManager"
import type { SceneDefinition } from "./sceneManager"
import { changeDataServer } from "../utils/utils"
import showServer from "../utils/showServers"

export function registerChangeNameScene(bot: Bot) {
    const scene: SceneDefinition = {
        name: "server_change_name",
        steps: [
            async (userId, _text, _state) => {
                await bot.api.sendMessageToUser(userId, "Введите новое название")
            },
            async (userId, text, state) => {
                state.data.newName = text
                changeDataServer(state.data.server_id, { name: state.data.newName })
                await bot.api.sendMessageToUser(userId, "Название сервера изменено")
                sceneManager.leave(userId)
            }
        ]
    }
    sceneManager.registerScene(scene)
}
