/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Scenes } from "telegraf";
import { Users } from "../../prisma/generated/prisma";


export interface userContext extends Context{
    user? : Users
    sessionUser? : Record<string, any>
}

export default interface WizardUserContext extends userContext, Scenes.WizardContext {}


