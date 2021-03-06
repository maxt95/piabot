import { MessageEmbed } from 'discord.js'
import { Command, Ticket, Guild } from './db/schema.js'

const setRoles = async (user, existingRoles, newRoles) => {
  const roles = existingRoles.concat(newRoles)
  try {
    await user.roles.set(roles)
  } catch(error) {
    console.log(error)
  }
}

const getUser = async (guildId, userId) => {
  const guild = await Guild.findOne({ guildId: guildId }).exec()
  const user = await guild.users.filter((user) => {
    return user.userId === userId
  })[0]
  return user
}

const calculateExperience = async (message) => {
  const { content, member, guild } = message
  const words = content.split(' ')
  const guildExperience = await Guild.findOne({guildId: guild.id }).exec()
  const config = guildExperience.config
  
  const experience = words.length * config.experienceValue
  const currency = words.length * config.currencyValue

  const user = await guildExperience.users.filter((user) => {
    return user.userId === member.id
  })

  if (user.length === 0) {
    guildExperience.users.push({
      guildId: guild.id,
      userId: member.id,
      experience: experience,
      currency: currency,
    })
    await guildExperience.save()
  } else {
    user[0].experience += experience
    user[0].currency += currency
    await guildExperience.save()
  }
}

const messageHandler = (client) => {
  //TODO CACHE THE USER ROLES
  client.on('message', async (message) => {
    const { content, member, guild } = message
    
    if (content.startsWith('!')) {
      const { roles } = member
      const id = Array.from(roles.cache.filter(role => process.env.COMMAND_ROLES.split(',').includes(role.id)).values())

      if (id.length > 0) {
        let commandPhrase = content.slice(1)
        commandPhrase = commandPhrase.split(' ')
        let command 
        command = commandPhrase[0]
        const user = message.mentions.members.first()
        try {
          const existingCommands = await Command.find({guild: guild.id}).exec()
          
          existingCommands.forEach((com) => {
            let c
            if (commandPhrase.length > 1) {
              c = commandPhrase[0] + ' ' + commandPhrase[1]
            }         
            if(c === com.command) {
              if (com.deletable === true) message.delete()

              if(com.removeRoles.length > 0 || com.addRoles.length > 0) {
                const existingRoles = Array.from(user.roles.cache.filter(role => !role.id.includes(com.removeRoles)).values())
                setRoles(user, existingRoles, com.addRoles)
              }

              if (com.botResponse !== '')  {
                let response = com.botResponse
                response = response.replace("<user>", `<@${user.id}>`)
                message.channel.send(response)
              }  
            }
          })

          if(command === 'flip') {
            if(Math.random() >= 0.5) {
              message.channel.send(`<@${member.id}> flipped Heads`) 
            } else {
              message.channel.send(`<@${member.id}> flipped Tails`)
            }
          } else if(command === 'ts') {
            message.delete()
            const tickets = await Ticket.find().exec()
            let initialized
            tickets.forEach(ticket => {
              if(ticket.guild === guild.id) {
                message.channel.send('Ticket system already initialized.')
                initialized = true
              } else {
                initialized = false
              }
            })

            if(!initialized) {
              let categoryId = message.channel.parent.id
              let logChannelId
              if(commandPhrase[1] || commandPhrase[2]) {
                categoryId = commandPhrase[1]
                logChannelId = commandPhrase[2]
              }
              const embed = new MessageEmbed()
                .setTitle('Contact Staff')
                .setColor(0x0083FF)
                .setDescription('Open a ticket to report a member of the server or talk to staff about an issue. Click the below reaction to get started.')
              
              try {
                const ticketMessage = await message.channel.send(embed)
                await ticketMessage.react('📧')

                Ticket.create({
                  guild: guild.id,
                  channelId: message.channel.id,
                  messageId: ticketMessage.id,
                  categoryChannelId: categoryId,
                  ticketCount: 0,
                  initialBotMessage: "Please type your message below and a Staff member will be with you shortly.",
                  logChannel: logChannelId
                })
              } catch (error) {
                console.error(error)
              }        
            }
          } else if(command === 'tsclose') {
            let finalArray = []
            try {
              const ch = await message.channel.fetch()
              
              const messages = await ch.messages.fetch()
          
              const putInArray = async (data) => finalArray.push(data);
        
              putInArray(`${message.channel.name}`)
              for (const m of messages.array().reverse()) await putInArray(`${m.author.username}: ${m.content}`)
            

            } catch (error) {
              console.error(error)
            }
           
            await message.channel.delete('Closing ticket via bot')
            const tickets = await Ticket.find().exec()
            let updatedMemberList
            tickets.forEach(async (ticket) => {
              if(ticket.guild === guild.id) {
                updatedMemberList = ticket.activeMemberTickets.filter(m => {
                  return m.channelId !== message.channel.id
                })
                await Ticket.findOneAndUpdate({_id: ticket.id}, {activeMemberTickets: updatedMemberList}).exec()
                try {
                  await guild.channels.cache.get(ticket.logChannel).send(finalArray)
                } catch(error) {
                  console.error(error)
                }
              }
            })
   
          } else if (command === 'expInit') {
            await Guild.create({
              guildId: guild.id,
              config: { guildId: guild.id },
            })
          } else if (command === 'experience') {   
            const user = await getUser(guild.id, member.id)
            message.channel.send('Your current xp value: ' + user.experience)
          } else if (command === 'currency') {
            const user = await getUser(guild.id, member.id)
            message.channel.send('Your current currency amount: ' + user.currency)
          } else if (command === 'train') {
            // creating dataset for predicting when a user joins the server
            // get channel id
            // get all messages in channel
            // save message id and timestamp to db
            // output console training complete
          } else if (command === 'wordCount') {
            const messages = await message.channel.messages.fetch({ limit: 100, force: true})
            console.log(messages.array().length)
            message.channel.send(messages.array().length + ' total messages in this channel')
          } 
          
          else {
            
          }

        } catch(error) {
          console.log(error)
        }
      } else {
        let command = content.slice(1)
        if(command === 'flip') {
          message.delete()
          if(Math.random() >= 0.5) { 
            message.channel.send(`<@${member.id}> flipped Heads`) 
          } else {
            message.channel.send(`<@${member.id}> flipped Tails`)
          }
        }
      }    
    } else {
      calculateExperience(message)
    }  
  })
}

export default messageHandler