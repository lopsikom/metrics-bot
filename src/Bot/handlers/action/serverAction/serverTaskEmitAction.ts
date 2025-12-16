import actionHandler from "@botModels/actionHandler";
import ScenesEnum from "@botModels/Scenes/scenesEnum";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";

const serverTaskEmitAction : actionHandler = {
    trigger : /SERVER_TASK_EMIT_*/,
    handler : async(ctx) => {
        const serverId = getDataFromRegEx(ctx)
        ctx.answerCbQuery()
        if(!serverId) return
        ctx.scene.enter(ScenesEnum.SERVER_TASK_EMIT, {serverId})
      
    }
}
export default serverTaskEmitAction