import userContext from "../models/userContext";


export default function getDataFromRegEx(ctx : userContext) : string | undefined {
    const callbackQuery = ctx.callbackQuery;
        if (!callbackQuery || !('data' in callbackQuery)) return;
        const data = callbackQuery.data;
        if (!data) return
        const split = data.split("_")
        return split[split.length - 1]
}