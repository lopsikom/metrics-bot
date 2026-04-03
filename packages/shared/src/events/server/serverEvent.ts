
export interface UserPrisma{
    id : string,
    telegram_id : string | null,
    max_id : string | null,
    first_name : string,
    second_name : string | null,
    login : string | null
}
export interface UserPrismaAdd{
    telegram_id? : string | null,
    max_id? : string | null,
    first_name : string,
    second_name? : string | null,
    login? : string | null
}
export interface ServerPrisma {
    id : string,
    name : string,
    host : string,
    user_id : string
}
export interface ServerPrismaAdd {
    name : string,
    host : string,
    user_id : string
}
export interface TaskPrisma{
    id : string,
    name : string
    interval : string,
    server_id : string,
    chat_id : string,
    messenger : string
}
export interface TaskPrismaWithServer extends TaskPrisma{
    servers : {
        host : string
    }
}
export interface TaskPrismaAdd{
    interval : string,
    server_id : string,
    chat_id : string,
    name : string,
    messenger? : string
}
export interface LinkAccountData{
    source_messenger : "telegram" | "max",
    source_id : string,
    target_messenger : "telegram" | "max",
    target_id : string,
}
export interface LinkAccountResult{
    success : boolean,
    error? : string,
    user? : UserPrisma
}