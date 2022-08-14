// module.export = {}

const discordjs = require('discord.js');
const { TextChannel, MessageEmbed, MessageEmbedImage, Interaction, MessageAttachment, Constants, Permissions, getString} = require('discord.js');


module.exports = {
     name: "send",
     description: 'send a message',
     type: Constants.ApplicationCommandTypes.CHAT_INPUT,

     permissions: [Permissions.FLAGS.ADMINISTRATOR],
     options: [
      {
         name: 'channel' , 
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
        name: 'title',
        description: 'set a title in message',
        type: Constants.ApplicationCommandOptionTypes.STRING,
        required: false
      },
      {
        name: 'image',
        description: 'attach a image to make message embeds clean',
        type: Constants.ApplicationCommandOptionTypes.ATTACHMENT,
        required: false
      }
  ],

  slash : true,
  async execute({ message, interaction }) {
    const channel = (message ? message.mentions.channels.first() : interaction.options.getChannel('channel'))
    if (!channel || channel.type !== 'GUILD_TEXT') {
        return 'please tag a text channel.'
    }

    
    const attachment = interaction.options.getAttachment('attachment')
    const file = require('discord.js');

    const embed = new MessageEmbed();
    embed.setTitle('')
    embed.setImage(attachment)
    embed.setDescription("");
    channel.send({ embeds: [embed], files: [file] });

    if (interaction) {
      interaction.reply({
        content: "Send message!",
        ephemeral: true,
      });
    }
  },
};
