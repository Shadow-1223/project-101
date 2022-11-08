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
            type : Constants.ApplicationCommandOptionTypes.CHANNEL ,
            required : true 
        },
        {
            name : "message" ,
            description : "Type a word like 'etc' " ,
            type : Constants.ApplicationCommandOptionTypes.STRING ,
            required : true 
        },
        {
            name : "title" ,
            description : "Write something about your wolrd or news using title" ,
            type : Constants.ApplicationCommandOptionTypes.STRING ,
            required : false
        },
        {
            name : "attachment",
            description : "Attach any image from your gallery/album" ,
            type : Constants.ApplicationCommandOptionTypes.ATTACHMENT ,
            required : false
        },
        {
            name : "hex_color",
            description : "Paste or type what embed color you want to put" ,
            type : Constants.ApplicationCommandOptionTypes.STRING ,
            required : false
        }
    ],
    
    async execute({ interaction , message , options }) {
        if(message) return message.reply({
            content : "You can't run `setup_messages` command on legacy command" ,
            allowedMentions : {
                repliedUser : false
            }
        })
        
        const channel = options.getChannel("channel" , true)
        const textMessage = options.getString("message" , true)
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
            .setColor(hexColor)
        )
        
        const embed = new MessageEmbed()
        if(embedTitle) embed.setTitle(embedTitle)
        embed.setDescription(textMessage)
        try {
            embed.setColor(hexColor)
        } catch {
            embed.setColor(null)
        }
        
        textEmbeds.push(embed)
        channel.send({ embeds : textEmbeds })
        
        if(interaction) {
            interaction.reply({
                content : `Your message has been in ${channel}` ,
                ephemeral: true
            })
        }
    }
}
