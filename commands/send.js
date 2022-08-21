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

    //let attachment = interaction.options.getAttachment('attachment')
    const text = interaction.options.getString('text')
    const title = options.getString('title') ? options.getString('title') : ""

    /*const embeds = new MessageEmbed()
      embeds.setImage(attachment)*/

    const embed = new MessageEmbed()
      embed.setTitle(title)
      embed.setDescription(text)
    await interaction.deferReply({embeds: [embed]})
    await interaction.followUp({content: `i have successfully send ur message in ${channel}`, ephemeral: true})

    if (interaction && interaction.channel.id !== channel.id) {
      interaction.deferReply({
        content: 'send message!',
        ephemeral: true
      })
    } 
  }
}
