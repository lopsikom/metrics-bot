import {addPendingRequest, consume, publish, QueueEvent } from "@bot/shared";
import prometheusAPI from "./prometheus/prometheusAPI";
import prometheusConfig from "./prometheus/prometheusConfig";

await consume(QueueEvent.PROMETHEUS_CONFIG_ADD_TARGET, async (data) => {
    const response = await prometheusConfig.addTargetConfig(data.data.server_ip, data.data.name)
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PROMETHEUS_CONFIG_CHANGE_TARGET, async (data) => {
    const response = await prometheusConfig.changeTargetConfig(data.data.name, data.data.oldServer_ip, data.data.newServer_ip);
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PROMETHEUS_CONFIG_CHECK, async (data) => {
    const response = await prometheusConfig.checkConfig(data.data.first_name, data.data.id);
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PROMETHEUS_CONFIG_REMOVE_TARGET, async (data) => {
    const response = await prometheusConfig.removeTargeConfig(data.data.server_ip, data.data.name);
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PROMETHEUS_API_GET_SERVER_METRICS, async (data) => {
    const response = await prometheusAPI.getServerMetrics(data.data)
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PROMETHEUS_API_CHECK_UP_SERVER, async (data) => {
    const response = await prometheusAPI.checkUpServer(data.data)
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})
await consume(QueueEvent.PROMETHEUS_API_GET_SERVER_INFO, async (data) => {
    const response = await prometheusAPI.getServerInfo(data.data);
    await publish(data.replyTo, {replyTo : data.replyTo, data : response}, {
        listenOnce : true,
        autoDelete : true,
        expires : 3600
    })
})

console.log("metrics-service start")

