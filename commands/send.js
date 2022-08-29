const { Permissions, Constants, MessageEmbed, MessageAttachment } = require("discord.js");

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
    {
      name: 'attachment',
      description: 'attach an image',
      type: Constants.ApplicationCommandOptionTypes.ATTACHMENT,
      required: false
    },
    { 
      name: 'title',
      description: 'type a title',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    },
    { 
      name: 'hexcolor',
      description: 'put a hexcolor',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    }
  ],
  slash: true,
  async execute({ interaction, message, client, options }) {
    if(message) return message.reply({
        content : 'this cmd is not working on leagcy cmd',
        allowedMentions : {
            repliedUser: false
        }
    })
   
    const channel = options.getChannel('channel')

    const attachment = options.getAttachment('attachment')
    const hexcolor = options.getString('hexcolor')

    const text = options.getString('text')
    const title = options.getString('title')
    const embeds = [];

    if (attachment) embeds.push(
         new MessageEmbed()
             .setImage(attachment.url)
             .setColor(hexcolor)
         )

    const embed = new MessageEmbed()
      if(title) embed.setTitle(title)
      embed.setDescription(text)
      try {
          embed.setColor(hexcolor)
      } catch {
          embed.setColor(null)
      }
      embeds.push(embed)
      
    channel.send({ embeds: embeds })
    interaction.reply({ content: `message was sent by ${interaction.user.tag.mention} in: ${channel}`, ephemeral: true })
  }
}
