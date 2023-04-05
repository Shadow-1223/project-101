/*const { Permissions , Constants } = require("discord.js")

module.exports = {
    name : "echo" ,
    description : "Echoes your words" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES] ,
    type : Constants.ApplicationCommandTypes.CHAT_INPUT ,
    aliases : ["tell" , "say"] ,
    slash : true ,
    options : [
        {
            name : "message" ,
            description : "Write a words" ,
            type : Constants.ApplicationCommandOptionTypes.STRING ,
            required : true
        }
    ],
    
    async execute({ interaction , message , options , args }) {
        if(message) {
            const text = args.join(" ")
            if(!text) return message.reply({
                content : "You need to specify what words you wanna echo" ,
                allowedMentions : {
                    repliedUser : false
                }
            })
            await message.reply({
                content : `You said **${text}**`
            })
        }
        
        if(interaction) {
            const text = options.getString("message")
            await interaction.reply({
                content : `You said **${text}**`
            })
        }
    }
}*/
