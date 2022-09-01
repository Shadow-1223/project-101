const Commando = require('discord.js-commando')
const { Permissions } = require('discord.js')

module.exports (message) = class SetSuggestionChannelCommand extends Commando.commands {
    constructor(client) {
        super(client, {
            name: 'setsuggestions',
            group: 'suggestions',
            memberName: 'setsuggestions',
            userPermissions: [
                Permissions.FLAGS.ADMINISTRATOR
            ],
            description: 'set the suggestions channel'
        })
    }
    
    
    run = async (message) => {
        const {
            channel: { id },
        } = message 
    }
}
