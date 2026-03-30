
import { Scenes } from "telegraf";
import ScenesEnum from "../models/Scenes/scenesEnum";
import { addServerPrisma, addTargetConfig } from "../utils/utils";
import handlersCollector from "../services/handlersCollector";

export const scene = new Scenes.WizardScene<any>(ScenesEnum.ADD_SERVER, //Добавить валидатор значений
    (ctx) => {
    ctx.reply('Введите название сервера')
    return ctx.wizard.next()
}, (ctx) =>{
    ctx.wizard.state.name = ctx.message!.text
    ctx.reply('Введите адрес сервера с портом при наличии')
    return ctx.wizard.next()
},  (ctx) =>{
    ctx.wizard.state.server_ip = ctx.message!.text
    addServerPrisma(ctx.user?.id, ctx.wizard.state.name, ctx.wizard.state.server_ip)
    addTargetConfig(ctx.wizard.state.server_ip, ctx.user!.first_name)
    ctx.reply(`${ctx.wizard.state.name} по адресу ${ctx.wizard.state.server_ip} успешно зарегистрирован`)
    return ctx.scene.leave()
})

handlersCollector.addScenes(scene)
