/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Scenes } from "telegraf";
import { UserPrisma } from "@bot/shared";


export interface userContext extends Context{
    user? : UserPrisma
}

export default interface WizardUserContext extends userContext, Scenes.WizardContext {}


