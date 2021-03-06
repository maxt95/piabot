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

const userSchema = new mongoose.Schema({
  guildId: {
    type: String,
  },
  userId: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0,
  },
  currency: {
    type: Number,
    default: 0,
  },
  roles: {
    type: Array,
    default: [],
  }
})

const currencySchema = new mongoose.Schema({
  roleName: {
    type: String,
  },
  amountRequired: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  }
})

const experienceSchema = new mongoose.Schema({
  roleName: {
    type: String,
  },
  amountRequired: {
    type: Number,
    default: 0,
  }
})

const configSchema = new mongoose.Schema({
  guildId: {
    type: String,
  },
  expDefaultRate: {
    type: Number,
    default: 1,
  },
  expBoostRate: {
    type: Number,
    default: 1.5,
  },
  currencyDefaultRate: {
    type: Number,
    default: 1,
  },
  currencyBoostRate: {
    type: Number,
    default: 1.5,
  },
  experienceValue: {
    type: Number,
    default: 1,
  },
  currencyValue: {
    type: Number,
    default: 1,
  }
})

const guildSchema = new mongoose.Schema({
  guildId: {
    type: String,
    unique: true,
  },
  users: {
    type: [userSchema],
  },
  experience: {
    type: [experienceSchema],
  },
  currency: {
    type: [currencySchema],
  },
  config: {
    type: configSchema,
  }
})

// const userJoinSchema = new mongoose.Schema({
//   messageId: {
//     type: String,
//   },
//   timestamp: {
//     type: String,
//   }
// })

export const Ticket = mongoose.model('Ticket', ticketSchema)

export const Command = mongoose.model('Command', commandSchema)

// export const userJoinSchema = mongoose.model('UserJoin', userJoinSchema)

export const Guild = mongoose.model('Guild', guildSchema)
export const User = mongoose.model('User', userSchema)