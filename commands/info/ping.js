const { Permissions, Constants } = require("discord.js");

module.exports = {
    name : 'ping',
    description : 'Replies with a pong !',
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    slash : true,
    async execute({interaction}){

        if(interaction){
            await interaction.reply({content : 'Pong !'})
        }
    }
}
