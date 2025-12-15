import ScenesEnum from "@botModels/Scenes/scenesEnum";
import prisma from "@prisma/prismaClient";
import showServer from "Bot/utils/showServers";
import { Scenes } from "telegraf";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeNameServerScene = new Scenes.WizardScene<any>(ScenesEnum.SERVER_CHANGE_NAME, 
    (ctx) => {
        ctx.reply(`Введите новое название`)
        return ctx.wizard.next()
    },
    async (ctx) => {
        ctx.wizard.state.newName = ctx.message.text
        await prisma.changeDataServer(ctx.wizard.state.server_id, {name : ctx.wizard.state.newName})
        await ctx.reply(`Название сервера изменено`)
        await ctx.scene.leave()
        await showServer(ctx, ctx.wizard.state.server_id)
    }
)

export default changeNameServerScene