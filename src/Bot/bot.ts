import { Telegraf } from "telegraf";
import dotenv from "dotenv"
import {useAction, useActionInlineKeyboard, useHandlers, useHearsReplyKeyboard, useWizardScene} from "./handlers/handlerFactory";
import setStart from "./handlers/start";
import accountHandler from "./handlers/keyboards/reply/account";
import startAction from "./handlers/keyboards/inline/start";
import userMiddleware from "./middlewares/userMiddleware";
import WizardUserContext from "./models/userContext";
import helpHandler from "./handlers/keyboards/reply/help";
import howToStartAction from "./handlers/keyboards/inline/howToStart";
import serverHandler from "./handlers/keyboards/reply/servers";
import addServer from "./Scenes/addServer";
import addServerInline from "./handlers/keyboards/inline/addServer";
import serverAction from "./handlers/action/serverAction";
import deleteServerAction from "./handlers/action/deleteServerAction";

dotenv.config()

const bot = new Telegraf<WizardUserContext>(process.env.BOT_TOKEN ?? "")
//Команды до подключения основого middleware
setStart(bot)
useActionInlineKeyboard(bot, startAction)
bot.use(userMiddleware)
useWizardScene(bot, addServer)
useAction(bot, serverAction, deleteServerAction)
useHandlers(bot)
useHearsReplyKeyboard(bot, accountHandler, helpHandler, serverHandler)
useActionInlineKeyboard(bot, howToStartAction, addServerInline)

export default bot