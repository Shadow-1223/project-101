const { MessageAttachment } = require("discord.js")
// const fs = require("fs")
// const path = require("path")
const Canvas = require("canvas")
// Canvas.registerFont('../fonts/OpenSans-Bold.ttf', { family : 'Open Sans', weight: "bold"})

/* function fontFile (name) {
    return path.join(__dirname, '../font', name)
}*/


module.exports = {
    name : "guildMemberAdd" ,
    async run(client , member) {
        const welcomeCanvas = {};
        welcomeCanvas.create = Canvas.createCanvas(1024, 500)
        welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
       // welcomeCanvas.registerFont('../fonts/OpenSans-Bold.ttf', { family : 'Open Sans'})
        welcomeCanvas.context.font = '72px Open Sans Bold';
        welcomeCanvas.context.fillStyle = '#ffffff';
        
        Canvas.loadImage("./structures/Images/Welcomebg.jpg").then(async (img) => {
            welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
            welcomeCanvas.context.fillText("welcome", 360, 360);
            welcomeCanvas.context.beginPath();
            welcomeCanvas.context.arc(512, 166, 128, 0, Math.PI * 2, true);
            welcomeCanvas.context.stroke()
            welcomeCanvas.context.fill()
        })
        
        const welcomechannel = client.channels.cache.get('981108742714196051')
        let canvas = welcomeCanvas;
        canvas.context.font = '42px Open Sans Bold',
        canvas.context.textAlign = 'center';
        canvas.context.fillText(member.user.tag.toUpperCase(), 512, 410)
        canvas.context.font = '32px Open Sans Bold'
        canvas.context.fillText(`You are the ${member.guild.memberCount.toLocaleString()}th`, 512, 455)
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

