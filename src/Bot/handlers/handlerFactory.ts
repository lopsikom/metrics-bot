/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scenes, session, Telegraf } from "telegraf"
import KeyboardHandler from "../models/keyboards/keyboardHandler"
import { WizardScene } from "telegraf/typings/scenes"
import WizardUserContext from "@botModels/userContext"
import actionHandler from "@botModels/actionHandler"


export const useHandlers = (bot : Telegraf<WizardUserContext>, ...args : ((bot : Telegraf<WizardUserContext>) => void)[]) =>{
    args.forEach(handler => {
       handler(bot)
    })
}
export const useAction = (bot : Telegraf<WizardUserContext>, ...args : actionHandler[]) => {
    args.forEach(handler => {
        bot.action(handler.trigger, handler.handler)
    })
}

export const useHearsReplyKeyboard = (bot : Telegraf<WizardUserContext>, ...args : KeyboardHandler[]) =>{
    args.forEach(handler =>{
        bot.hears(handler.title, handler.handler)
    })
}
export const useActionInlineKeyboard = (bot: Telegraf<WizardUserContext>, ...args: KeyboardHandler[]) =>{
    args.forEach(action =>{
        bot.action(action.title, action.handler)
    })
}
export const useWizardScene = (bot: Telegraf<WizardUserContext>, ...args: WizardScene<any>[]) =>{
    const stage = new Scenes.Stage(args)
    bot.use(session())
    bot.use(stage.middleware())
}
