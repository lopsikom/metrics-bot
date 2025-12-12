import prisma from "@prisma/prismaClient";
import prometheus from "@prometheus/prometheusConfig";
import { Scenes } from "telegraf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scene = new Scenes.WizardScene<any>("add_server", //Добавить валидатор значений
    (ctx) => {
    ctx.reply('Введите название сервера')
    return ctx.wizard.next()
}, (ctx) =>{
    ctx.wizard.state.name = ctx.message!.text
    ctx.reply('Введите адрес сервера с портом при наличии')
    return ctx.wizard.next()
},  (ctx) =>{
    ctx.wizard.state.server_ip = ctx.message!.text
    prisma.addServer(ctx.user?.id, ctx.wizard.state.name, ctx.wizard.state.server_ip)
    prometheus.addTargetConfig(ctx.wizard.state.server_ip, ctx.user!.first_name)
    ctx.reply(`${ctx.wizard.state.name} по адресу ${ctx.wizard.state.server_ip} успешно зарегистрирован`)
    return ctx.scene.leave()
})

export default scene
