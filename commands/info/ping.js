const { Command , CommandMode } = require("sdhandler");
const { Constants, Permissions } = require("discord.js")

module.exports = new Command({
    name : "ping", // Name of the command
    description : "Pings the sender!", // Brief description of the command
    mode : CommandMode.Both, // Mode of the command - Legacy , Slash or Both
    async execute({ message , interaction , member }) { // Command callback function
        if(message) return message.reply({content : `Hey , ${member}`})

        else {
            return interaction.reply({content : `Hey , ${member}`})
        }
    }
})
