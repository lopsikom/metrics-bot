import prometheus from '@prometheus/prometheus'
import Bot from './Bot/bot'
console.log("Bot is running")
prometheus.removeTargeConfig('213.5.221.198')
Bot.launch()
