const { MessageEmbed , GuildMember , MessageAttachment } = require("discord.js")
const { Event } = require("sdhandler")
const Canvas = require("canvas")

module.exports = new Event("guildMemberUpdate", async (oldMember , newMember , interaction) => {
    /**
     * @param {Guildmember} oldMember
     * @param {GuildMember} newMember
     * 
    */
    const { guild } = newMember
    
    let Thankyou = new MessageEmbed()
    .setColor("PURPLE")
    .setAuthor("SERVER BOOSTED", guild.iconURL({ dynamic : true , size : 512 }))
    
    if(!oldMember.premiumSince && newMember.premiumSince) {
        const canvas = Canvas.createCanvas(800 , 250)
        const ctx = canvas.getContext("2d")
        
        const background = await Canvas.loadImage(".../structures/Images/booster.png")
        
        ctx.strokeStyle = "#e60000"
        cts.strokeRect(0 , 0 , canvas.height , canvas.weight)
        
        ctx.font = "18px cursive"
        ctx.textAlign = "center"
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(newMember.displayName , canvas.weight / 2 , canvas.height / 2)
        
        const avatar = await Canvas.loadImage(newMember.user.displayAvatarURL({ format : "png" }))
        
        ctx.beginPath()
        ctx.arc(125 , 125 , 100 , Math.PI * 2 , true)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(avatar , 25 , 25 , 200 , 200)
        
        
        const attachment = new MessageAttachment(canvas.toBuffer(), "booster.png")
        
        Thankyou.setDescription(`<@&${interaction.user.id}> has boosted the server!`)
        Thankyou.setImage("attachment://booster.pnt")
        
        guild.systemChannel.send({
            embeds : [Thankyou],
            files : [attachment]
        })
        
        Thankyou.setDescription("Thank you for boosting the server")
        newMember.send({ embeds : [Thankyou] })
    }
})
