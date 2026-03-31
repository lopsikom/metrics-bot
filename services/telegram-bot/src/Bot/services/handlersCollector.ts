/* eslint-disable @typescript-eslint/no-explicit-any */
import { Scenes, session, Telegraf } from "telegraf";
import { WizardScene } from "telegraf/scenes";
import WizardUserContext from "../models/userContext";
import IHandler from "../models/handler";
import setStart from "../handlers/start";

export class handlersCollector {
    private handlersCollected : IHandler[] = []
    private middlewaresCollected : ((ctx : WizardUserContext, next: () => Promise<any>) => Promise<any>)[] = []
    private scenesCollected : WizardScene<any>[] =[]


    addHandlers(...args : IHandler[]){
        this.handlersCollected = this.handlersCollected.concat(args)
    }
    addMiddlewares(...args : ((ctx : WizardUserContext, next: () => Promise<any>) => Promise<any>)[]){
        this.middlewaresCollected = this.middlewaresCollected.concat(args)
    }
    addScenes(...args : WizardScene<any>[]) {
        this.scenesCollected = this.scenesCollected.concat(args)
    }
    initHandlers(bot : Telegraf<WizardUserContext>){
        setStart(bot)
        this.middlewaresCollected.forEach(m =>{
            bot.use(m)
        })
        const stage = new Scenes.Stage(this.scenesCollected)
        bot.use(session())
        bot.use(stage.middleware())
        this.handlersCollected.forEach(h =>{
            switch (h.type){
                case "action":
                    bot.action(h.trigger,h.handler)
                    break
                case "inlineKeyboard":
                    bot.action(h.trigger, h.handler)
                    break
                case "replyKeyboard":
                    bot.hears(h.trigger, h.handler)
                    break
            }
        })

    }
}

export default new handlersCollector()