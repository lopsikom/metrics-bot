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
import dotenv from 'dotenv'
import WizardUserContext from "@botModels/userContext"


dotenv.config()

const bot = new Telegraf<WizardUserContext>(process.env.BOT_TOKEN ?? "")

export default bot