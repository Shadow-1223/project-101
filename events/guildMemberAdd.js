const { MessageAttachment } = require("discord.js")
const Canvas = require("canvas")

module.exports = {
    name : "guildMemberAdd" ,
    async run(member , ) {
        const welcomeCanvas = {};
        welcomeCanvas.create = Canvas.createCanvas(1024, 500)
        welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
        welcomeCanvas.context.font = '72px sans-serif';
        welcomeCanvas.context.fillStyle = '#ffffff';
        
        Canvas.loadImage(".../structures/images/welcomebg.png").then(async (img) => {
            welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
            welcomeCanvas.context.fillText("welcome", 360, 360);
            welcomeCanvas.context.beginPath();
            welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
            welcomeCanvas.context.stroke()
            welcomeCanvas.context.fill()
        })
        
        const welcomechannel = client.guild.channels.cache.get('981108742714196051')
        let canvas = welcomeCanvas;
        canvas.context.font = '42px sans-serif',
        canvas.context.textAlign = 'center';
        canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410)
        canvas.context.font = '32px sans serif'
        canvas.context.fillText(`You are the ${member.guild.memberCount}th`, 512, 455)
        canvas.context.beginPath()
        canvas.context.arc(512, 166, 119, 0, Math.PI * 2, true)
        canvas.context.closePath()
        canvas.context.clip()
        await Canvas.loadImage(member.user.displayAvatarURL({format: 'png', size: 1024}))
        .then(img => {
            canvas.context.drawImage(img, 393, 47, 238, 238);
        })
        let atta = new MessageAttachment(canvas.create.toBuffer(), `welcome-${member.id}.png`)
        try {
            welcomechannel.send(`:wave: Hello ${member}, welcome to ${member.guild.name}!`, atta)
        } catch (error) {
            
            console.log(error)
        }
    }
}
