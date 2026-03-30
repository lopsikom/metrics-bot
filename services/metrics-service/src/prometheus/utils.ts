import { addPendingRequest, QueueEvent } from "@bot/shared"

export async function getServersPrisma(id : string){
     const data = await addPendingRequest(QueueEvent.PRISMA_GET_USER_SERVER, id);
     return data
}