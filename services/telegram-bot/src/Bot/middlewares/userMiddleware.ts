/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserPrisma } from "@bot/shared";
import userContext from "../models/userContext";
import handlersCollector from "../services/handlersCollector";
import { createNewUser, getUserById, getUserByTgId } from "../utils/utils";
import {getRedisData, KeysEnum, setRedisData} from "@bot/shared-redis"

handlersCollector.addMiddlewares(async (ctx : userContext, next: () => Promise<any>) => {
    console.log("middleware")
    const tgId = ctx.from?.id;
    if(!tgId) return next();

    if(ctx.user){
        return next();
    }

    try {
        const cachedUser = await getRedisData(KeysEnum.USER_BY_TELEGRAM_ID, tgId.toString())
        console.log("cache ", cachedUser)
        if(cachedUser) {
            ctx.user = cachedUser
            return next();
        }
        const dbUser = await getUserByTgId(tgId.toString());
        if(dbUser){
            ctx.user = dbUser;
            setRedisData(KeysEnum.USER_BY_TELEGRAM_ID, dbUser.telegram_id!.toString(), dbUser)
            console.log("caching")
            return next();
        }
        const user = await createNewUser(ctx.from.id.toString(), ctx.from.first_name, ctx.from.last_name, ctx.from.username)
        ctx.user = user
        await setRedisData(KeysEnum.USER_BY_TELEGRAM_ID, user.telegram_id!.toString(), user);
        return next();
    } catch (e) {
        console.error("userMiddleware failed", e)
        try {
            await ctx.reply("Сервис временно недоступен, попробуйте позже.")
        } catch { /* ignore */ }
    }
})