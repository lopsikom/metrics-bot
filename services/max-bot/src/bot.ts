import { Bot } from "@maxhub/max-bot-api"
import dotenv from "dotenv"
import { registerStartHandler } from "./handlers/start"
import { registerCommands } from "./handlers/commands"
import { registerMenuHandlers } from "./handlers/menuHandlers"
import { registerServerActions } from "./handlers/serverAction"
import { registerTaskActions } from "./handlers/taskAction"
import { registerAddServerScene } from "./scenes/addServerScene"
import { registerChangeNameScene } from "./scenes/changeNameScene"
import { registerChangeHostScene } from "./scenes/changeHostScene"
import { registerTaskEmitScene } from "./scenes/taskEmitScene"
import { registerLinkAccountScene } from "./scenes/linkAccountScene"
import sceneManager from "./scenes/sceneManager"

dotenv.config()

const bot = new Bot(process.env.MAX_BOT_TOKEN ?? "")

registerStartHandler(bot)
registerCommands(bot)
registerMenuHandlers(bot)
registerServerActions(bot)
registerTaskActions(bot)

registerAddServerScene(bot)
registerChangeNameScene(bot)
registerChangeHostScene(bot)
registerTaskEmitScene(bot)
registerLinkAccountScene(bot)

bot.on("message_created", async (ctx) => {
    const userId = ctx.message?.sender?.user_id
    if (!userId) return
    const text = ctx.message?.body?.text
    if (!text) return

    const handled = await sceneManager.handleMessage(userId, text)
    // if (!handled) {
    // }
})

export default bot
