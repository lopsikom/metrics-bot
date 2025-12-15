import actionHandler from "@botModels/actionHandler";
import prometheusAPI from "@prometheus/prometheusAPI";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";

const metricServerAction : actionHandler = {
    trigger : /SERVER_METRICS_*/,
    handler : async (ctx) => {
        try{
            const serverIp = getDataFromRegEx(ctx)
            if(!serverIp) return
            const metrics = await prometheusAPI.getServerMetrics(serverIp)
            await ctx.reply(
                `📊 Метрики сервера *${serverIp}*:\n\n` +
                `🧠 CPU: ${(metrics.cpu * 100).toFixed(1)}%\n` +
                `💾 RAM: ${(metrics.ram * 100).toFixed(1)}%\n` +
                `📀 Disk: ${(metrics.disk * 100).toFixed(1)}%`,
                { parse_mode: "Markdown" }
            );
            await ctx.answerCbQuery()
        }catch(e){
            console.log(e)
            ctx.reply(`Ошибка: ${e}`)
            await ctx.answerCbQuery()
        }
    }
}
export default metricServerAction