const { Permissions , Constants , MessageEmbed } = require("discord.js")

module.exports = {
    name : "ping" ,
    description : "Replied with a pong!" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES] ,
    type : Constants.ApplicationCommandTypes.CHAT_INPUT ,
    aliases : ["p"] ,
    slash : true ,
    
    async execute({ interaction , args , messages , client }) {
        if(interaction) {
            const ping =  new Date().getTime() - interaction.createdTimestamp
            const time = Math.round(client.ws.ping)
            
            const pingEmbed = new MessageEmbed()
            .setTitle("🏓 Pong!")
            .setDescription("**Lentacy:** \n " + `${ping}ms` + "\n **API** \n")
            
            interaction.reply({ embeds : pingEmbed })
        }
    }
}
