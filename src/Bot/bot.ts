import { Telegraf } from "telegraf";
import dotenv from "dotenv"
import {useActionInlineKeyboard, useHandlers, useHearsReplyKeyboard} from "./handlers/handlerFactory";
import setStart from "./handlers/start";
import accountHandler from "./handlers/keyboards/reply/account";
import startAction from "./handlers/keyboards/inline/start";
import userMiddleware from "./middlewares/userMiddleware";
import userContext from "./models/userContext";

dotenv.config()

const bot = new Telegraf<userContext>(process.env.BOT_TOKEN ?? "")

setStart(bot)
bot.use(userMiddleware)
useHandlers(bot)
useHearsReplyKeyboard(bot, accountHandler)
useActionInlineKeyboard(bot, startAction)

export default bot