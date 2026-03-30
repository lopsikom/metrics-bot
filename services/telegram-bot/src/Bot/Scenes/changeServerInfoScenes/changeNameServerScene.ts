
import ScenesEnum from "src/Bot/models/Scenes/scenesEnum";
import handlersCollector from "src/Bot/services/handlersCollector";
import showServer from "src/Bot/utils/showServers";
import { changeDataServer } from "src/Bot/utils/utils";
import { Scenes } from "telegraf";

const changeNameServerScene = new Scenes.WizardScene<any>(ScenesEnum.SERVER_CHANGE_NAME, 
    (ctx) => {
        ctx.reply(`Введите новое название`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.wizard.state.newName = ctx.message.text
        changeDataServer(ctx.wizard.state.server_id, {name : ctx.wizard.state.newName})
        await ctx.reply(`Название сервера изменено`)
        await ctx.scene.leave()
        await showServer(ctx, ctx.wizard.state.server_id)
    }
)

handlersCollector.addScenes(changeNameServerScene)