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
            const pingLine = inlineCode(`${ping}ms`);
            const inlineCode = inlineCode(`${pingTime}ms`);

            const pingEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🏓 | Pong!")
            .addFields(
                [
                    {
                        name : "Lentacy:" ,
                        value : `${pingLine}`
                    },
                    {
                        name : "API:" ,
                        value : `${inlineCode}`
                    }
                ]
            )
            
            interaction.reply({ embeds : [pingEmbed] })
        }
        
        if(message) {
            const ping = new Date().getTime() - message.createdTimestamp
            const wsPing = Math.round(client.ws.ping)
            const wsInline = inlineCode(`${ping}ms`);
            const inline = inlineCode(`${wsPing}ms`);

            const timeEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🏓 | Pong")
            .addFields(
                [
                    {
                        name : "Lentacy:" ,
                        value : `${wsInline}`
                    },
                    {
                        name : "API:" ,
                        value : `${inline}`
                    }
                ]
            )
            
            message.reply({
                embeds : [timeEmbed] ,
                allowedMentions : {
                    repliedUser : false
                }
            })
        }
    }
}
