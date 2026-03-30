/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Scenes } from "telegraf";
import { Servers, Users } from "../../../../server-service/prisma/generated/prisma";


export interface userContext extends Context{
    user? : Users
    sessionUser? : Record<string, any>
    currentServer? : Servers
}

export default interface WizardUserContext extends userContext, Scenes.WizardContext {}


