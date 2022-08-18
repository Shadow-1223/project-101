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
  async execute({ interaction }) {
    if(interaction.user.id !== '802089688647204874') {
      return interaction.reply({content : 'you cant run this cmd', ephemeral: true})
    }
  
    const channel = interaction.options.getChannel('channel');

    const attachment = interaction.options.getAttachment('attachment')
    const text = interaction.options.getString('text')
    const title = interaction.options.getString('title')

    const file = new MessageAttachment()

    const msg2 = new MessageEmbed()
      .setImage(attachment)

    const msg1 = new MessageEmbed()
      .setTitle(`${title}`)
      .setDescription(text)
    interaction.channel.send({ embeds: [msg2, msg1], files: [file] })


    if (interaction) {
      interaction.reply({
        content: 'send message!',
        ephemeral: true
      })
    }
  }
}