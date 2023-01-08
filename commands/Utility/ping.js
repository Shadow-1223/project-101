const { Permissions , Constants , MessageEmbed } = require("discord.js")
const { inlineCode } = require("@discordjs/builders")

module.exports = {
    name : "ping" ,
    description : "Replied with a pong!" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES] ,
    type : Constants.ApplicationCommandTypes.CHAT_INPUT ,
    aliases : ["p"] ,
    slash : true ,
    
    async execute({ interaction , args , message , client }) {
        if(interaction) {
            const ping =  new Date().getTime() - interaction.createdTimestamp
            const pingTime = Math.round(client.ws.ping)
            const pingLine = inlineCode(ping);
            const inlineCode = inlineCode(pingTime);

            const pingEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🏓 : Pong!")
            .addFields(
                [
                    {
                        name : "Lentacy:" ,
                        value : `${pingLine}ms`
                    },
                    {
                        name : "API:" ,
                        value : `${inlineCode}ms`
                    }
                ]
            )
            
            interaction.reply({ embeds : [pingEmbed] })
        }
        
        if(message) {
            const ping = new Date().getTime() - message.createdTimestamp
            const wsPing = Math.round(client.ws.ping)
            const wsInline = inlineCode(ping);
            const inline = inlineCode(wsPing);

            const timeEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🏓 : Pong")
            .addFields(
                [
                    {
                        name : "Lentacy:" ,
                        value : `${wsInline}ms`
                    },
                    {
                        name : "API:" ,
                        value : `${inline}ms`
                    }
                ]
            )
            
            message.reply({
                embeds : [timeEmbed] ,
                allowedMentions : {
                    repliedUser : true
                }
            })
        }
    }
}
