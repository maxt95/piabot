import Discord from 'discord.js'
import dotenv from 'dotenv'
import messageHandler from './messages.js'

dotenv.config()
const client = new Discord.Client()

client.once('ready', () => {
  console.log('piabot in startup')
})

messageHandler(client)

client.login(process.env.DISCORD_TOKEN)