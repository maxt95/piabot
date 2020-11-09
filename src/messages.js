import { Command } from './db/schema.js'

const setRoles = async (user, existingRoles, newRoles) => {
  const roles = existingRoles.concat(newRoles)
  try {
    await user.roles.set(roles)
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
              const existingRoles = Array.from(user.roles.cache.filter(role => !role.id.includes(com.removeRoles)).values())
              setRoles(user, existingRoles, com.addRoles)
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