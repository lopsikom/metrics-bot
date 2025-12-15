import actionHandler from "@botModels/actionHandler";
import ScenesEnum from "@botModels/Scenes/scenesEnum";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";

const changeHostServer : actionHandler = {
    trigger : /SERVER_CHANGE_HOST_*/,
    handler : async (ctx) => {
        const server_id =  getDataFromRegEx(ctx)
        await ctx.answerCbQuery();
        ctx.scene.enter(ScenesEnum.SERVER_CHANGE_HOST,{server_id})
    }
}

export default changeHostServer