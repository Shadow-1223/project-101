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
      description: 'type a message title',
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: false
    }
  ],
  slash: true,
  async execute({ interaction, message }) {
    if(message) return message.reply({content : 'this cmd is not working on leagcy cmd'})
    
    const channel = interaction.options.getChannel("channel");

    const attachment = interaction.options.getAttachment('attachment')
    const text = interaction.options.getString('text')
    const title = interaction.options.getString('title')
    console.log(title)

    const msg2 = new MessageEmbed()
      .setImage(attachment)
      .setDescription(title)

    const msg1 = new MessageEmbed()
      .setDescription(text)
    interaction.channel.send({ embeds: [msg2, msg1] })


    if (interaction) {
      interaction.reply({
        content: 'send message!',
        ephemeral: true
      })
    }
  }
}
