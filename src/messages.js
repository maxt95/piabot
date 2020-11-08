import { Command } from './db/schema.js'

const addRoles = async (user, roles) => {
  try {
    await user.roles.add(roles)
  } catch(error) {
    console.log(error)
  }
}

const removeRoles = async (user, roles) => {
  try {
    await user.roles.remove(roles)
  } catch(error) {
    console.log(error)
  }
}

const messageHandler = (client) => {
  client.on('message', async (message) => {
    const { content, member, guild } = message

    if (content.startsWith('!')) {
      const { roles } = member
      const id = Array.from(roles.cache.filter(role => role.id == process.env.COMMAND_ROLES).values())

      if (id.length > 0) {
        let commandPhrase = content.slice(1)
        commandPhrase = commandPhrase.split(' ')
        const command = commandPhrase[0] + ' ' + commandPhrase[1]
        const user = message.mentions.members.first()
  
        const existingCommands = await Command.find({guild: guild.id}).exec()

        existingCommands.forEach((com) => {
          if(command === com.command) {
            if (com.deletable === true) message.delete()
            if (com.addRoles.length > 0) addRoles(user, com.addRoles)
            if (com.removeRoles.length > 0) removeRoles(user, com.removeRoles)
            if (com.botResponse !== '')  message.channel.send(com.botResponse)
          }
        })
      }    
    }  
  })
}

export default messageHandler