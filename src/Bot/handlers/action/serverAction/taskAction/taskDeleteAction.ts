import actionHandler from "@botModels/actionHandler";
import croneTask from "Bot/services/croneTask";
import getDataFromRegEx from "Bot/utils/getDataFromRegEx";

const taskDeleteAction : actionHandler = {
    trigger: /TASK_DELETE_*/,
    handler : async (ctx) => {
        const taskId = getDataFromRegEx(ctx)
        if(!taskId) return
        const result = await croneTask.unEmitTask(taskId)
        if(result) ctx.reply("Уведомление удаленно")
        else ctx.reply("Не удалось удалить уведомление")
        ctx.answerCbQuery()

    }
}

export default taskDeleteAction