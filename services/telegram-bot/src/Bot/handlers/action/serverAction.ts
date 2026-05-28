import ScenesEnum from "src/Bot/models/Scenes/scenesEnum"
import handlersCollector from "src/Bot/services/handlersCollector"
import getDataFromRegEx from "src/Bot/utils/getDataFromRegEx"
import showServer from "src/Bot/utils/showServers"
import { checkConfig, deleteServer, getServerMetrics, getServerPrisma, removeTargeConfig } from "src/Bot/utils/utils"
import { Markup } from "telegraf"


handlersCollector.addHandlers({
    type : 'action',
    trigger : /SELECT_SERVER_*/,
    handler : async (ctx) => {
        try{
        const result = await checkConfig(ctx.user!.id, ctx.from!.first_name)
        if(!result){
            ctx.reply("Произошла ошибка")
            await ctx.answerCbQuery()
            return
        }
        await showServer(ctx)
        await ctx.answerCbQuery()
        }catch(e){
            console.log(e)
            ctx.reply(`Ошибка: ${e}`)
            await ctx.answerCbQuery()
        }

    }
},
{
    type : 'action',
    trigger : /SERVER_METRICS_*/,
    handler : async (ctx) => {
        try{
            const serverIp = getDataFromRegEx(ctx)
            if(!serverIp) return
            const metrics = await getServerMetrics(serverIp)
            await ctx.reply(
                `📊 Метрики сервера *${serverIp}*:\n\n` +
                `🧠 CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                `🧠 Количество процессов ${metrics.fork.toFixed(1)}\n` +
                `💾 RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                `📀 Disk: ${(metrics.disk * 100).toFixed(1)}%\n` +
                `🌐 Входящий трафик: ${metrics.receiveNetwork.toFixed(1)} Мбит\n` +
                `🌐 Исходящий трафик: ${metrics.transmitNetwork.toFixed(1)} Мбит\n`,
                { parse_mode: "Markdown" }
            );
            await ctx.answerCbQuery()
        }catch(e){
            console.log(e)
            ctx.reply(`Ошибка: ${e}`)
            await ctx.answerCbQuery()
        }
    }
},
{
    type : "action",
    trigger : /DELETE_SERVER_*/,
    handler : async(ctx) => {
        const serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const server = await getServerPrisma(serverId)
        if(!server) return
        deleteServer(serverId)
        removeTargeConfig(server.host, ctx.user!.first_name)
        await ctx.reply("Сервер удалён")
    }
},
{
    type : 'action',
    trigger : /SERVER_CHANGE_INFO_*/,
    handler : (ctx) => {
        const server_id = getDataFromRegEx(ctx)
        console.log(server_id)
        ctx.reply("Выберите что хотите изменить",
            Markup.inlineKeyboard([[Markup.button.callback("Название", `SERVER_CHANGE_NAME_${server_id}`)],
        [Markup.button.callback("Адрес",`SERVER_CHANGE_HOST_${server_id}`)],[Markup.button.callback("Назад",`SELECT_SERVER_${server_id}`)]])
        )
        ctx.answerCbQuery()
    }
},
{
    type : 'action',
    trigger : /SERVER_CHANGE_NAME_*/,
    handler : async(ctx) =>{
        console.log("scene ", ctx.scene)
        console.log(ctx.session)
        const server_id =  getDataFromRegEx(ctx)
        await ctx.answerCbQuery();
        ctx.scene.enter(ScenesEnum.SERVER_CHANGE_NAME,{server_id})

    }
},
{
    type : 'action',
    trigger : /SERVER_CHANGE_HOST_*/,
    handler : async (ctx) => {
        const server_id =  getDataFromRegEx(ctx)
        await ctx.answerCbQuery();
        ctx.scene.enter(ScenesEnum.SERVER_CHANGE_HOST,{server_id})
    }
}
)