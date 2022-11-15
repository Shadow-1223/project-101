const { Permissions , Constants , MessageEmbed } = require("discord.js")

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
            
            const pingEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🏓 Pong!")
            .addFields(
                [
                    {
                        name : "Lentacy:" ,
                        value : `\`${ping}ms\``
                    },
                    {
                        name : "API:" ,
                        value : `\`${pingTime}ms\``
                    }
                ]
            )
            
            interaction.reply({
                embeds : [pingEmbed] ,
                allowedMentions : {
                    repliedUser : false
                }
            })
        }
        
        if(message) {
            const ping = new Date().getTime() - message.createdTimestamp
            const wsPing = Math.round(client.ws.ping)
            
            const timeEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("🏓 Pong")
            .addFields(
                [
                    {
                        name : "Lentacy:" ,
                        value : `\`${ping}ms\``
                    },
                    {
                        name : "API:" ,
                        value : `\`${wsPing}ms\``
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
