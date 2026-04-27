import { IUser } from "./user";

export enum KeysEnum {
    USER_BY_MAX_ID = "user_by_max_id",
    USER_BY_TELEGRAM_ID = "user_by_max_id"
}

export interface RedisKeys {
    [KeysEnum.USER_BY_MAX_ID] : IUser,
    [KeysEnum.USER_BY_TELEGRAM_ID] : IUser
}