import { Markup } from "telegraf";
import KeyboardHandler from "../../../models/keyboards/keyboardHandler";
import ReplyKeyboardEvents from "../../../models/keyboards/replyEnum";
import inlineKeyboardEvent from "../../../models/keyboards/inlineEnum";

const startAction : KeyboardHandler = {
    title : inlineKeyboardEvent.START,
    handler : (ctx) =>{
        ctx.reply('Начало', Markup.keyboard([[ReplyKeyboardEvents.SERVERS, ReplyKeyboardEvents.ACCOUNT], 
            [ReplyKeyboardEvents.ABOUT, ReplyKeyboardEvents.HELP]]).resize())
    }
}
export default startAction