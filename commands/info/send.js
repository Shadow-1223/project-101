const { Command , CommandMode } = require("sdhandler")
const { Permissions , Constants , MessageEmbed } = require("discord.js")

module.exports = new Command({
    name : "send",
    description : "Send messages to specify channel",
    mode : CommandMode.Slash,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    aliases : ["s"],
    options : [
        {
            name : "channel",
            description : "Specify channel you want your message to be sent!",
            type : Constants.ApplicationCommandOptionTypes.CHANNEL,
            required : true
        },
        {
            name : "message",
            description : "Type something you like. ex: 'smh'",
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : "title",
            description : "Type something idk maybe like 'wow'",
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : false 
        },
        {
            name : "attachment",
            description : " Attach a image from your gallery/album",
            type : Constants.ApplicationCommandOptionTypes.ATTACHMENT,
            required : false 
        },
        {
            name : "hex_color",
            description : "Type what Hex Color you want",
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : false
        },
    ],
    
    async execute({ interaction , message , options }) {
        if(message) return message.reply({
            content : "You can't run this command on legacy command",
            allowedMentions : {
                repliedUser : false
            }
        })
        
        const channel = options.getChannel("channel")
        const textMessage = options.getString("message")
        const title = options.getString("title")
        
        const attachment = options.getAttachment("attachment")
        const hexColor = options.getString("hex_color")
        const embeds = []
        
        if(attachment) embeds.push(
            new MessageEmbed()
            .setImage(attachment)
            .setColor(hexColor.toUpperCase())
        )
        
        const embed = new MessageEmbed()
        if(title) embed.setTitle(title)
        embed.setDescription(textMessage)
        try {
            embed.setColor(hexColor)
        } catch {
            embed.setColor(null)
        }
        
        embeds.push(embed)
        channel.send({ embeds : embeds })
        
        if(interaction) {
            interaction.reply({
                content : `Your message has been sent in ${channel}`,
                ephemeral : true
            })
        }
    }
})
