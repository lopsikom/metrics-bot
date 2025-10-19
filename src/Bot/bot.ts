import { Telegraf } from "telegraf";
import dotenv from "dotenv"
import {useActionInlineKeyboard, useHandlers, useHearsReplyKeyboard} from "./handlers/handlerFactory";
import setStart from "./handlers/start";
import accountHandler from "./handlers/keyboards/reply/account";
import startAction from "./handlers/keyboards/inline/start";

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN ?? "")

useHandlers(bot, setStart)
useHearsReplyKeyboard(bot, accountHandler)
useActionInlineKeyboard(bot, startAction)

export default bot