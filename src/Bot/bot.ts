import { Telegraf } from "telegraf";
import dotenv from "dotenv"
import {useActionInlineKeyboard, useHandlers, useHearsReplyKeyboard} from "./handlers/handlerFactory";
import setStart from "./handlers/start";
import accountHandler from "./handlers/keyboards/reply/account";
import startAction from "./handlers/keyboards/inline/start";
import userMiddleware from "./middlewares/userMiddleware";
import userContext from "./models/userContext";
import helpHandler from "./handlers/keyboards/reply/help";
import howToStartAction from "./handlers/keyboards/inline/howToStart";

dotenv.config()

const bot = new Telegraf<userContext>(process.env.BOT_TOKEN ?? "")
//Команды до подключения основого middleware
setStart(bot)
useActionInlineKeyboard(bot, startAction)

bot.use(userMiddleware)
useHandlers(bot)
useHearsReplyKeyboard(bot, accountHandler, helpHandler)
useActionInlineKeyboard(bot, howToStartAction)

export default bot