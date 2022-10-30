const { Permissions , Constants , MessageEmbed } = require("discord.js")

module.exports = {
    name : "setup_messages" ,
    description : "Send messages to specify channel" ,
    type : Constants.ApplicationCommandTypes.CHAT_INPUT ,
    permissions : [Permissions.FLAGS.ADMINISTRATOR] ,
    aliases : ["Sm"] ,
    slash : true ,
    options : [
        {
            name : "channel" ,
            description : "Select a channel were your message to be sent" ,
            required : true ,
            type : Constants.ApplicationCommandOptionTypes.CHANNEL ,
        },
        {
            name : "message" ,
            description : "Type a word like 'etc' " ,
            required : true ,
            type : Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name : "title" ,
            description : "Write something about your wolrd or news using title" ,
            required : true ,
            type : Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name : "attachment",
            description : "Attach any image from your gallery/album" ,
            required : true ,
            type : Constants.ApplicationCommandOptionTypes.ATTACHMENT
        },
        {
            name : "hex_color",
            description : "Paste or type what embed color you want to put" ,
            required : true ,
            type : Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    
    async execute({ interaction , message , options }) {
        if(message) return message.reply({
            content : "You can't run `setup_messages` command on legacy command" ,
            allowedMentions : {
                repliedUser : false
            }
        })
        
        const channel = options.getChannel("channel")
        const textMessage = options.getString("message")
        const embedTitle = options.getString("title")
        
        const attachment = options.getAttachment("attachment")
        const hexColor = options.getString("hex_color")
        if(!hexColor) return interaction.reply({
            content : "invalid embed color" ,
            ephemeral : true
        })
        
        const textEmbeds = []
        
        if(attachment) textEmbeds.push(
            new MessageEmbed()
            .setImage(attachment)
            .setColor(hexColor.toUpperCase())
        )
        
        const embed = new MessageEmbed()
        if(title) embed.setTitle(embedTitle)
        embed.setDescription(textMessage)
        try {
            embed.setColor(hexColor.toUpperCase())
        } catch {
            embed.setColor(null)
        }
        
        textEmbeds.push(embed)
        channel.send({ embeds : textEmbeds })
        
        if(interaction) {
            interaction.reply({
                content : `Your message has been in ${channel}`
                ephemeral: true
            })
        }
    }
}
