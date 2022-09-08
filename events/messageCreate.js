const { MessageEmbed }= require('discord.js')

module.exports = {
    name : 'messageCreate',
    async run(client , message) {
        client.on('messageCreate', aaync (message) => {
            if(message.channel.id === '986920640227459115') {
                let embed = new MessageEmbed()
                .setTitle('New Suggestions')
                .setColor('Yellow')
                .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true }) }` })
                .setDescription(`${message.content}`)
                .setTimestamp()
                
                message.channel.send({ embeds: [embed] }).then(async (msg) => {
                    await message.delete()
                    msg.react("👍")
                    msg.react("👎")
                })
            }
        })
    }
}
