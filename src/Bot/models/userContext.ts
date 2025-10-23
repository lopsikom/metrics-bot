/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from "telegraf";
import { Users } from "../../prisma/generated/prisma";


export default interface userContext extends Context{
    user? : Users
    session? : Record<string, any>
}
