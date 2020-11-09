import { Command } from './db/schema.js'

const addRoles = async (user, roles) => {
  try {
    console.log('adding roles: ', roles)
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
      const id = Array.from(roles.cache.filter(role => process.env.COMMAND_ROLES.split(',').includes(role.id)).values())

      if (id.length > 0) {
        let commandPhrase = content.slice(1)
        commandPhrase = commandPhrase.split(' ')
        const command = commandPhrase[0] + ' ' + commandPhrase[1]
        const user = message.mentions.members.first()

        try {
          const existingCommands = await Command.find({guild: guild.id}).exec()

          existingCommands.forEach((com) => {
            if(command === com.command) {
              if (com.deletable === true) message.delete()
              if (com.addRoles.length > 0) addRoles(user, com.addRoles)
              if (com.removeRoles.length > 0) removeRoles(user, com.removeRoles)
              if (com.botResponse !== '')  {
                let response = com.botResponse
                response = response.replace("<user>", `<@${user.id}>`)
                message.channel.send(response)
              }
            }
          })
        } catch(error) {
          console.log(error)
        }
      }    
    }  
  })
}

export default messageHandler