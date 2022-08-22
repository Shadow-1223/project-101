const { Permissions, Constants, MessageEmbed, MessageAttachment } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  name: 'send',
  description: 'just a copy of send slash command',
  permissions: [Permissions.FLAGS.ADMINISTRATOR],
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  options: [
    {
      name: 'channel',
      description: 'mention a channel',
      type: Constants.ApplicationCommandOptionTypes.CHANNEL,
      required: true
    },
    {
      name: 'text',
      description: 'type a message',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true
    },
    /*{
      name: 'attachment',
      description: 'attach an image',
      type: Constants.ApplicationCommandOptionTypes.ATTACHMENT,
      required: false
    }*/
    { 
      name: 'title',
      description: 'type a title',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    }
  ],
  slash: true,
  async execute({ interaction, message, client, options }) {
    if(message) return message.reply({content : 'this cmd is not working on leagcy cmd'})
   
     const channel = options.getChannel('channel')
     if(!channel) return interaction.reply({content: `mention a channel!`, ephemeral: true});


    let attachment = options.getAttachment('attachment') 
    const text = options.getString('text')
    const title = options.getString('title') ? options.getString('title') : ""

    const embeds = new MessageEmbed()
      embeds.setImage(attachment)

    const embed = new MessageEmbed()
      embed.setTitle(title)
      embed.setDescription(text)
   interaction.reply({content: `your message was sent in: ${channel}`, ephemeral: true})
   channel.send({embeds: [embed, embeds]})
   
  }
}
