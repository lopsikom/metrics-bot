import { Scenes } from "telegraf";
import ScenesEnum from "../models/Scenes/scenesEnum";
import { linkAccount } from "../utils/utils";
import handlersCollector from "../services/handlersCollector";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const scene = new Scenes.WizardScene<any>(ScenesEnum.LINK_ACCOUNT,
    async (ctx) => {
        await ctx.reply("Введите ваш Max ID.\nУзнать его можно в разделе «Аккаунт» Max бота.")
        return ctx.wizard.next()
    },
    async (ctx) => {
        const maxId = ctx.message?.text?.trim()
        if (!maxId || !/^\d+$/.test(maxId)) {
            await ctx.reply("Некорректный ID. Max ID должен быть числом. Попробуйте /start заново.")
            return ctx.scene.leave()
        }

        const result = await linkAccount(ctx.from.id.toString(), maxId)
        if (result.success) {
            await ctx.reply("Аккаунт успешно привязан к Max!")
        } else {
            await ctx.reply(`Не удалось привязать: ${result.error}`)
        }
        return ctx.scene.leave()
    }
)

handlersCollector.addScenes(scene)
