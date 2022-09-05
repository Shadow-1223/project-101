const { Permissions, Constants } = require("discord.js");

module.exports = {
    name : 'echo',
    description : 'Echoes your words.',
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    aliases : ['tell' , 'say'],
    options : [
        {
            name : 'text' , 
            description : 'Text',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        }
    ],
    slash : true,
    async execute({interaction , options , args , message}){
        if(message){
            const text = args.join(' ')
            if(!text) return message.reply({content : "You need to specify what you wanna Echo."})
            await message.reply({content : `You said **${text}**`})
        }
        if(interaction){
            const text = options.getString('text')
            await interaction.reply({content : `You said **${text}**`})
        }
    }
}
