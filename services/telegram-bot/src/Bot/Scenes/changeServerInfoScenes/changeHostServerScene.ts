import ScenesEnum from "src/Bot/models/Scenes/scenesEnum";
import handlersCollector from "src/Bot/services/handlersCollector";
import showServer from "src/Bot/utils/showServers";
import { changeDataServer, changeTargetConfig, getServerPrisma } from "src/Bot/utils/utils";
import { Scenes } from "telegraf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeHostServerScene = new Scenes.WizardScene<any>(ScenesEnum.SERVER_CHANGE_HOST,
    (ctx) => {
        ctx.reply('Введите новый адрес сервера')
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.wizard.state.newHost = ctx.message.text
        const server = await getServerPrisma(ctx.wizard.state.server_id)
        if(!server) {ctx.reply('Сервер не найден'); return}
        await changeDataServer(ctx.wizard.state.server_id, {host : ctx.wizard.state.newHost})
        await ctx.reply('Адрес сервера изменён')
        await ctx.scene.leave()
        await changeTargetConfig(ctx.user.first_name, server.host, ctx.wizard.state.newHost) 
        await showServer(ctx, ctx.wizard.state.server_id)
    }
)
handlersCollector.addScenes(changeHostServerScene)
