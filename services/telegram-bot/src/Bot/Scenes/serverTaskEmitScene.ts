
import { Markup, Scenes } from "telegraf";
import ScenesEnum from "../models/Scenes/scenesEnum";
import { emitTask, getServerPrisma, getUserByTgId } from "../utils/utils";
import handlersCollector from "../services/handlersCollector";


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
    const server = await getServerPrisma(ctx.wizard.state.serverId);
    if(!server) return ctx.scene.leave()
    const user = ctx.user ?? await getUserByTgId(ctx.from.id.toString())
    const maxChatId = user?.max_id ?? undefined
    await emitTask(server.host, server.id, ctx.from.first_name, ctx.wizard.state.interval, ctx.chat!.id.toString(), ctx.wizard.state.name, maxChatId)
    ctx.reply("Уведомление зарегистрированно")
    return ctx.scene.leave()
})

handlersCollector.addScenes(scene)
