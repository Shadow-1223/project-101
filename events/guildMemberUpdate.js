const { GuildMember, MessageEmbed, MessageAttachment } = require("discord.js")
const Canvas = require("canvas")

module.exports = {
    name : "guildMemberUpdate",
    /**
    * 
    * @param {GuildMeber} oldMember
    * @param {GuildMember} newMeber
    */
    async run(newMember, oldMember, interaction) {
        const { guild } = newMember
        
        const ThankyouEmbed = new MessageEmbed()
        .setColor("PURPLE")
        .setAuthor("SERVER BOOSTED", guild.iconURL({ dynamic : true, size : 512 }))
        
        if(!oldMember.premiumSince && newMember.premiumSince) {
            const canvas = Canvas.createCanvas(800, 250)
            const ctx = canvas.getContext("2d")
        
            const background = await Canvas.loadImage(".../structures/Images/booster.png")
        
            ctx.strokeStyle = "#e60000"
            ctx.strokeRect(0, 0, canvas.width, canvas.height)
        
            ctx.font = "18px cursive"
            ctx.textAlign = "center"
            ctx.fillStyle = "#FFFFFF"
            ctx.fillText(newMember.displayName, canvas.width / 2, canvas.height / 1.2)
        
            const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({format : "png"}))
        
            ctx.beginPath()
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.clip()
            ctx.drawImage(avatar, 25, 25, 200, 200)
        
            const attachment = new MessageAttachment(canvas.toBuffer(), "booster.png")
            
            ThankyouEmbed.setDescription(`<@${interaction.user.id}> just boost the server`)
            ThankyouEmbed.setImage("attachment://booster.png")
            
            guild.systemChannel.send({
                embeds : [ThankyouEmbed], 
                files : [attachment]
            }).catch((err) => console.log(err))
            
            ThankyouEmbed.setDescription("Thank you for boosting the server!")
            newMember.send({ embeds : [ThankyouEmbed]})
        }
    }
}
