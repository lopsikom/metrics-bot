import ScenesEnum from "@botModels/Scenes/scenesEnum";
import prisma from "@prisma/prismaClient";
import croneTask from "Bot/services/croneTask";
import handlersCollector from "Bot/services/handlersCollector";
import { Markup, Scenes } from "telegraf";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scene = new Scenes.WizardScene<any>(ScenesEnum.SERVER_TASK_EMIT,
    async (ctx) => {
        await ctx.reply('Введите название для уведомления')
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.wizard.state.name = ctx.message.text
        await ctx.reply("Выберите промежутки времени",
            Markup.inlineKeyboard([
                [Markup.button.callback("1 минута", 'TIME_* * * * *'), Markup.button.callback("10 минут", 'TIME_*/10 * * * *')],
                [Markup.button.callback("Каждый час", 'TIME_0 * * * *'), Markup.button.callback('Каждый день', 'TIME_0 9 * * *')]
            ])
        )
        return ctx.wizard.next()
    }
)
scene.action(/TIME_(.+)/, async (ctx) => {
    const interval = ctx.match[1]
    console.log(interval)
    ctx.wizard.state.interval = interval
    await ctx.answerCbQuery();

    await ctx.editMessageText(`Выбранный интервал ${interval}`)
    console.log('server')
    const server = await prisma.getServer(ctx.wizard.state.serverId)
    if(!server) return ctx.scene.leave()
    await croneTask.emitTask(ctx,server, ctx.wizard.state.interval, ctx.wizard.state.name)
    ctx.reply("Уведомление зарегистрированно")
    return ctx.scene.leave()
})

handlersCollector.addScenes(scene)
