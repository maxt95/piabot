import Discord from 'discord.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import messageHandler from './messages.js'

dotenv.config()
mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('connected to database')
})

const client = new Discord.Client()

client.once('ready', () => {
  console.log('piabot in startup')
})

messageHandler(client)

client.login(process.env.DISCORD_TOKEN)