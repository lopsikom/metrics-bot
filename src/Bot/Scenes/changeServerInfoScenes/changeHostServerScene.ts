import ScenesEnum from "@botModels/Scenes/scenesEnum";
import prisma from "@prisma/prismaClient";
import prometheusConfig from "@prometheus/prometheusConfig";
import showServer from "Bot/utils/showServers";
import { Scenes } from "telegraf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeHostServerScene = new Scenes.WizardScene<any>(ScenesEnum.SERVER_CHANGE_HOST,
    (ctx) => {
        ctx.reply('Введите новый адрес сервера')
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.wizard.state.newHost = ctx.message.text
        const server = await prisma.getServer(ctx.wizard.state.server_id)
        if(!server) {ctx.reply('Сервер не найден'); return}
        await prisma.changeDataServer(ctx.wizard.state.server_id, {host : ctx.wizard.state.newHost})
        await ctx.reply('Адрес сервера изменён')
        await ctx.scene.leave()
        await prometheusConfig.changeTargetConfig(ctx.user.first_name, server.host, ctx.wizard.state.newHost) 
        await showServer(ctx, ctx.wizard.state.server_id)
    }
)
export default changeHostServerScene