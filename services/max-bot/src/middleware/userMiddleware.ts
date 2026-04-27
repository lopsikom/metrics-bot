import type { UserPrisma } from "@bot/shared"
import {getRedisData, KeysEnum, setRedisData} from "@bot/shared-redis"
import { createNewUser, getUserById, getUserByMaxId } from "../utils/utils"



export async function resolveUser(maxUserId: number, firstName: string, lastName?: string, username?: string): Promise<UserPrisma | null> {
    try {
        const cached = await getRedisData(KeysEnum.USER_BY_MAX_ID, maxUserId.toString())
        if (cached) {return cached}

        const user = await getUserByMaxId(maxUserId.toString())
        if (user) {
            await setRedisData(KeysEnum.USER_BY_MAX_ID, maxUserId.toString(), user)
            return user
        }

        const newUser = await createNewUser(maxUserId.toString(), firstName, lastName, username)
        if (newUser) {
            await setRedisData(KeysEnum.USER_BY_MAX_ID, maxUserId.toString(), newUser)
        }
        return newUser
    } catch (e) {
        console.error("resolveUser failed", e)
        return null
    }
}
