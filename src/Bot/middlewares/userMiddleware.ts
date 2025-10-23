/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "../../prisma/prismaClient";
import userContext from "../models/userContext";

export default async function userMiddleware(ctx : userContext, next: () => Promise<any>){
    const tgId = ctx.from?.id;
    console.log("Midlle")
    if(!tgId) return next();

    const sessionUserId = ctx.session?.userId as string | undefined;
    if(sessionUserId){
        const user = await prisma.getUserById(sessionUserId);
        console.log(user)
        if(user){
            ctx.user = user;
            return next();
        }
    }
    else{
        const user = await prisma.getUserByTgId(tgId.toString());
        console.log(user)
        if(user){
            ctx.user = user;
            return next();
        }
    }
    console.log('not user')
    const user = await prisma.createNewUser(ctx.from.id.toString(), ctx.from.first_name, ctx.from.last_name, ctx.from.username)

    ctx.user = user
    ctx.session = ctx.session ?? {}
    ctx.session.userId = user?.id
    return next();
    
}