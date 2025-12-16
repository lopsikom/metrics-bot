const croneTime : Record<string, string> = {
    '* * * * *' : "Каждую минуту",
    '*/10 * * * *': "Каждые 10 минут",
    '0 * * * *' : "Каждый час",
    '0 9 * * *' : 'Ежедневное'
}

export default croneTime