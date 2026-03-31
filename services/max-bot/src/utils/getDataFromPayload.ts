export default function getDataFromPayload(payload: string): string | undefined {
    if (!payload) return
    const split = payload.split("_")
    return split[split.length - 1]
}
