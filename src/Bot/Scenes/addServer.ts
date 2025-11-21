import prisma from "@prisma/prismaClient";
import prometheus from "@prometheus/prometheus";
import { Scenes } from "telegraf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scene = new Scenes.WizardScene<any>("add_server",
    (ctx) => {
    ctx.reply('Введите название сервера')
    return ctx.wizard.next()
}, (ctx) =>{
    ctx.wizard.state.name = ctx.message!.text
    ctx.reply('Введите адрес сервера с портом при наличии')
    return ctx.wizard.next()
}, (ctx) =>{
    ctx.wizard.state.server_ip = ctx.message!.text 
    ctx.reply("Введите эндпоинт по которому посылаются метрики\nНапример: /metrics")
    return ctx.wizard.next()
}, (ctx) =>{
    ctx.wizard.state.endpoint = ctx.message!.text
    prisma.addServer(ctx.user?.id, ctx.wizard.state.name, ctx.wizard.state.server_ip, ctx.wizard.state.endpoint)
    prometheus.addTargetConfig(ctx.wizard.state.server_ip)
    ctx.reply(`${ctx.wizard.state.name} по адресу ${ctx.wizard.state.server_ip}${ctx.wizard.state.endpoint} успешно зарегистрирован`)
    return ctx.scene.leave()
})

export default scene
