/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Scenes } from "telegraf";
import { Servers, Users } from "../../prisma/generated/prisma";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";


export interface userContext extends Context, Update.CallbackQueryUpdate<CallbackQuery>{
    user? : Users
    sessionUser? : Record<string, any>
    currentServer? : Servers
}

export default interface WizardUserContext extends userContext, Scenes.WizardContext {}


