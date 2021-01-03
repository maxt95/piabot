import mongoose from 'mongoose'

const commandSchema = new mongoose.Schema({
  guild: {
    type: String
  },
  command: {
    type: String
  },
  addRoles: {
    type: Array
  },
  removeRoles: {
    type: Array
  },
  botResponse: {
    type: String
  },
  deletable: {
    type: Boolean
  }
})

const ticketSchema = new mongoose.Schema({
  guild: {
    type: String,
  },
  channelId: {
    type: String,
  },
  messageId: {
    type: String,
  },
  reactionId: {
    type: String,
  },
  categoryChannelId: {
    type: String,
  },
  ticketCount: {
    type: Number,
  },
  initialBotMessage: {
    type: String,
  },
  activeMemberTickets: {
    type: Array,
  },
  logChannel: {
    type: String,
  }
})

const userJoinSchema = new mongoose.Schema({
  messageId: {
    type: String,
  },
  timestamp: {
    type: String,
  }
})

export const Ticket = mongoose.model('Ticket', ticketSchema)

export const Command = mongoose.model('Command', commandSchema)

export const userJoinSchema = mongoose.model('UserJoin', userJoinSchema)