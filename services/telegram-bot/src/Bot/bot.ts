import { Telegraf } from "telegraf"
import "./handlers/action/serverAction"
import  "./handlers/action/taskAction"
import  "./handlers/keyboards/inlineKeyboard"
import  "./handlers/keyboards/replyKeyboard"
import "./middlewares/userMiddleware"
import "./Scenes/addServer"
import "./Scenes/serverTaskEmitScene"
import "./Scenes/changeServerInfoScenes/changeHostServerScene"
import "./Scenes/changeServerInfoScenes/changeNameServerScene"
import "./Scenes/linkAccountScene"
import dotenv from 'dotenv'
import WizardUserContext from "./models/userContext"


dotenv.config()

const bot = new Telegraf<WizardUserContext>(process.env.BOT_TOKEN ?? "")

bot.catch(async (err, ctx) => {
    console.error(`Telegraf error for update ${ctx.updateType}:`, err)
    try {
        await ctx.reply("Произошла ошибка. Сервис временно недоступен, попробуйте позже.")
    } catch (e) {
        console.error("Failed to send error reply", e)
    }
})

export default bot