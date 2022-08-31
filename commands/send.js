const { Permissions, Constants, MessageEmbed } = require('discord.js')

module.exports = {
    name : 'send',
    description : 'Send a message',
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : 'channel',
            description : 'Specify a channel',
            type : Constants.ApplicationCommandOptionTypes.CHANNEL,
            required : true
        },
        {
            name : 'message',
            description : 'Type a Message in this options',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : 'title',
            description : 'Set a title in this options and it will show on the MessageEmbeds once it got sent',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : false
        },
        {
            name : 'attachment',
            description : 'Put a image from your gallery/album in this options and it will show in the MessageEmbed',
            type : Constants.ApplicationCommandOptionTypes.ATTACHMENT,
            required : false
        },
        {
            name : 'hex_color',
            description : 'Set/Type a hex color in this options and it will show in MessageEmbed',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : false
        }
    ],
    
    slash : true,
    async execute({ interaction , message , options }) {
        if(message) return message.reply({
            content : 'The command does not have legacy command build in. Please try use slash command',
            allowedMentions : {
                repliedUser: false
            }
        })
        
        const channel = options.getChannel('channel')
        const attachment = options.getAttachment('attachment')
        const hexColor = options.getString('hex_color')
        
        const text = options.getString('message')
        const title = options.getString('title')
        const embeds = [];
        
        if(attachment) embeds.push(
            new MessageEmbed()
               .setImage(attachment.url)
               .setColor(hexColor)
        )
        
        const embed = new MessageEmbed()
        if(title) embed.setTitle(title)
        embed.setDescription(text)
        try {
            embed.setColor(hexColor)
        } catch {
            embed.setColor(null)
        }
        embeds.push(embed)
        channel.send({ embeds : embeds })
        
        if(interaction) {
            interaction.reply({
                content : `Your message was sent in ${channel}`,
                ephemeral : true
            })
        }
    }
}
