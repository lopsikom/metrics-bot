import actionHandler from "@botModels/actionHandler";
import prisma from "@prisma/prismaClient";
import prometheus from "@prometheus/prometheusConfig";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";
import serverHandler from "../keyboards/reply/servers";

const deleteServerAction : actionHandler = {
    trigger : /DELETE_SERVER_*/,
    handler : async(ctx) => {
        const serverId = getDataFromRegEx(ctx)
        if(!serverId) return
        const server = await prisma.getServer(serverId)
        if(!server) return
        prisma.deleteServer(serverId)
        prometheus.removeTargeConfig(server.host, ctx.user!.first_name)
        await ctx.reply("Сервер удалён")
        return serverHandler.handler(ctx)
    }
}
export default deleteServerAction