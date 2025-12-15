import actionHandler from "@botModels/actionHandler";
import prometheusConfig from "@prometheus/prometheusConfig";;
import showServer from "Bot/utils/showServers";



const serverAction : actionHandler = { //Пофиксить типы
    trigger : /SELECT_SERVER_*/,
    handler : async (ctx) => {
        try{
        const result = await prometheusConfig.checkConfig(ctx)
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

}
export default serverAction