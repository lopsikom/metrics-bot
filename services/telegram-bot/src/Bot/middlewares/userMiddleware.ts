/* eslint-disable @typescript-eslint/no-explicit-any */
import userContext from "../models/userContext";
import handlersCollector from "../services/handlersCollector";
import { createNewUser, getUserById, getUserByTgId } from "../utils/utils";

handlersCollector.addMiddlewares(async (ctx : userContext, next: () => Promise<any>) => {
    console.log("middleware")
    const tgId = ctx.from?.id;
    if(!tgId) return next();

    const sessionUserId = ctx.sessionUser?.userId as string | undefined;
    if(sessionUserId){
        const user = await getUserById(sessionUserId);
        console.log(user)
        if(user){
            ctx.user = user;
            return next();
        }
    }
    else{
        const user = await getUserByTgId(tgId.toString());
        if(user){
            ctx.user = user;
            return next();
        }
    }
    console.log('not user')
    const user = await createNewUser(ctx.from.id.toString(), ctx.from.first_name, ctx.from.last_name, ctx.from.username)
    console.log("user ", user)
    ctx.user = user
    ctx.sessionUser = ctx.session ?? {}
    ctx.sessionUser.userId = user?.id
    return next();
    
})