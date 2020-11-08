
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
  client.on('message', message => {
    const { content, member } = message

    if (content.startsWith('!')) {
      const { roles } = member
      const id = Array.from(roles.cache.filter(role => role.id == process.env.COMMAND_ROLES).values())

      if (id.length > 0) {
        let commandPhrase = content.slice(1)
        commandPhrase = commandPhrase.split(' ')
        const command = commandPhrase[0]
        const user = message.mentions.members.first()
  
        console.log(command, commandPhrase)
        if(command === 'approve' && commandPhrase.length > 1) {
          message.delete()

          let approveMessage = true
          if(commandPhrase[1] === 'c') {
            addRoles(user, ['500630639729573903'])
            removeRoles(user, ['480748997846237194'])
          }
          else if(commandPhrase[1] === 'lo') {
            addRoles(user, ['480748578008989697', '480749987928735745'])
            removeRoles(user, ['480748997846237194'])
          }
          else if(commandPhrase[1] === 'lc') {
            addRoles(user, ['480748578008989697', '480750000419373057'])
            removeRoles(user, ['480748997846237194'])
          }
          else {
            // dm user and say oops wrong command?
            approveMessage = false
          }
          // send message if approveMessage
          if(approveMessage) message.channel.send('This is a response to your command')
        }
      }    
    }  
  })
}


export default messageHandler