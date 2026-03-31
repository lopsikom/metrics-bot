import type { UserPrisma } from "@bot/shared"
import { createNewUser, getUserById, getUserByMaxId } from "../utils/utils"

const userCache = new Map<number, { userId: string }>()
const userDataCache = new Map<string, UserPrisma>()

export async function resolveUser(maxUserId: number, firstName: string, lastName?: string, username?: string): Promise<UserPrisma | null> {
    const cached = userCache.get(maxUserId)
    if (cached) {
        const cachedUser = userDataCache.get(cached.userId)
        if (cachedUser) return cachedUser

        const user = await getUserById(cached.userId)
        if (user) {
            userDataCache.set(user.id, user)
            return user
        }
    }

    const user = await getUserByMaxId(maxUserId.toString())
    if (user) {
        userCache.set(maxUserId, { userId: user.id })
        userDataCache.set(user.id, user)
        return user
    }

    const newUser = await createNewUser(maxUserId.toString(), firstName, lastName, username)
    if (newUser) {
        userCache.set(maxUserId, { userId: newUser.id })
        userDataCache.set(newUser.id, newUser)
    }
    return newUser
}
