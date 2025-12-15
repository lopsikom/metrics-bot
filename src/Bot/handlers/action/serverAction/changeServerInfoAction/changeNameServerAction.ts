import actionHandler from "@botModels/actionHandler";
import ScenesEnum from "@botModels/Scenes/scenesEnum";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";

const changeNameServer : actionHandler = {
    trigger : /SERVER_CHANGE_NAME_*/,
    handler : async(ctx) =>{
        const server_id =  getDataFromRegEx(ctx)
        await ctx.answerCbQuery();
        ctx.scene.enter(ScenesEnum.SERVER_CHANGE_NAME,{server_id})

    }
}
export default changeNameServer