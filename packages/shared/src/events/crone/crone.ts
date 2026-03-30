export interface IEmitTask {
    host : string,
    server_id : string,
    first_name : string,
    chat_id : string,
    interval : string,
    name : string
}
export const croneTime : Record<string, string> = {
    '* * * * *' : "Каждую минуту",
    '*/10 * * * *': "Каждые 10 минут",
    '0 * * * *' : "Каждый час",
    '0 9 * * *' : 'Ежедневное'
}