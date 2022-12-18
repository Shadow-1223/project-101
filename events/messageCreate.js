const { MessageEmbed } = require("discord.js")

module.exports = {
    name : "messageCreate",
    async run(client, message) {
        if(message.channel.id == '981108742714196051') {
            let embed = new MessageEmbed()
            .setTitle("New suggestion")
            .setColor("Blue")
            .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
            .setDescription(`${message.content}`)
            .setTimestamp()

            message.channel.send({ embeds: [embed] }).then(async msg => {
                await message.delete()
                msg.react("👍")
                msg.react("👎")
            })
        }
    }
}
