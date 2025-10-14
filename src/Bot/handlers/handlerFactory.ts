import { Telegraf } from "telegraf"
import KeyboardHandler from "../models/keyboards/keyboardHandler"


export const useHandlers = (bot : Telegraf, ...args : Array<(bot : Telegraf) => void> ) =>{
    args.forEach(handler => {
       handler(bot)
    })
}

export const useHearsReplyKeyboard = (bot : Telegraf, ...args : [KeyboardHandler]) =>{
    args.forEach(handler =>{
        bot.hears(handler.title, handler.handler)
    })
}
export const useActionInlineKeyboard = (bot: Telegraf, ...args: [KeyboardHandler]) =>{
    args.forEach(action =>{
        bot.action(action.title, action.handler)
    })
}