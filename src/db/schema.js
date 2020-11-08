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

export const Command = mongoose.model('Command', commandSchema)