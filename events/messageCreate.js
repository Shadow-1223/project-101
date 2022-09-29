const { MessageEmbed } = require("discord.js")
const { Event } = require("sdhandler")

module.exports = new Event("messageCreate", async (message) => {
    if(message.channel.id === "921486948084895784") {
        let embed = new MessageEmbed()
        .setTitle("New Suggestions")
        .setColor("#FFFF00")
        .setAuthor({ name : `${message.author.tag}`, iconURL : `${message.author.displayAvatarURL({ dynamic : true})}`})
        .setDescription(`${message.content}`)
        .setTimestamp()
        
        message.channel.send({ embeds : [embed] }).then(msg => {
            message.delete()
            msg.react("👍")
            msg.react("👎")
        })
    }
})
