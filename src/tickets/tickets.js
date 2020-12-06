import { Ticket } from '../db/schema.js'

const ticketHandler = async (client) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.partial) {
      try {
        await reaction.fetch()
      } catch(error) {
        console.error('Something went wrong when fetching the message: ', error)
        return
      }
    }
    if(user.id != process.env.BOT_ID && reaction._emoji.name === '📧') {
      const tickets = await Ticket.find().exec()
      const reactionChannelId = reaction.message.channel.id
      const reactionMessageid = reaction.message.id
      const guild = reaction.message.channel.guild

      tickets.forEach(async (ticket) => {
        const foundUser = ticket.activeMemberTickets.map(member => {
          return member.id === user.id
        })
        if (foundUser.length == 0) {
          if(ticket.channelId === reactionChannelId && ticket.messageId === reactionMessageid) {
            const userReactionName = reaction._emoji.name
            if(userReactionName === '📧') {
              if(!ticket.activeMemberTickets.includes(user.id)) {
                const num = ticket.ticketCount + 1
                
                const ticketGuildChannel = await guild.channels.create(`ticket-${num}`, {
                  reason: 'Ticket Creation',
                  parent: ticket.categoryChannelId,
                })
                await ticketGuildChannel.lockPermissions()
                await ticketGuildChannel.updateOverwrite(user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
                const ticketChannel = await ticketGuildChannel.fetch()
  
                let array = ticket.activeMemberTickets
                array.push({
                  userId: user.id,
                  channelId: ticketChannel.id
                })
  
                await Ticket.findOneAndUpdate({_id: ticket.id}, {ticketCount: num, activeMemberTickets: array}).exec()
  
                ticketChannel.send(`<@${user.id}> ${ticket.initialBotMessage}`)
              }
            }
              
            
          }
        }
        reaction.users.remove(user.id)
        return false
      })
    }
  })
}

export default ticketHandler