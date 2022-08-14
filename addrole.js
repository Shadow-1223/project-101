const { Client, GuildMember, Interaction, Message, Constants, Permissions } = require('discord.js');
const { MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Options } = require('discord.js');
const discordjs = require('discord.js')

module.exports = {
    name : "addrole",
    description : 'adds a role to the auto role message.',
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,

    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name: 'channel',
            description: 'mention a channel',
            type: Constants.ApplicationCommandOptionTypes.CHANNEL,
            required: true
        },
        {
            name: 'messageid',
            description: 'copy a messageID from message',
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        },
        {
            name: 'role',
            description: 'type a role name to added it on dropdown menu',
            type: Constants.ApplicationCommandOptionTypes.ROLE,
            required: true
        }
    ],

    async init(client) {
       client.on('interactionCreate', Interaction => {
            if (!Interaction.isSelectMenu()) {
                return
            }

            const { customId, values, member } = Interaction

            if (customId === 'auto_roles') {
                const component = Interaction.component
                const removed = component.options.filter((options) => {
                    return !values.includes(options.value)
                })

                for (const id of removed) {
                    member.roles.remove(id.value)
                }

                for (const id of values) {
                    member.roles.add(id)
                }

                Interaction.reply({
                    content: 'Roles Update!',
                    ephemeral: true
                })
            }
        })
    },

    slash: true,
    async execute({ message, interaction, args, client }) {
        if(message) return message.reply({content : "this command only works on slash"})
                
        const channel = interaction.options.getChannel('channel');

        const messageId = options[1]

        const role = (message ? message.mentions.roles.first() : interaction.options.getRole('role'));
        if (!role) {
            return 'Unknown role'
        }

        const targetMessage = await channel.messages.fetch(messageId, {
            cache: true,
            force: true
        })

        if (!targetMessage) {
            return 'Unknown messages ID.'
        }

        if (targetMessage.author.id !== client.user?.id) {
            return `Please provide a message ID that was sent <@${client.user?.id}>`
        }

        let row = targetMessage.components[0]
        if (!row){
            row = new MessageActionRow()
        }

        const options = [{
            label: role.name,
            value: role.id
        }]

        let menu = row.components[0]
        if (menu) {
            for (const o of menu.options) {
                if (o.value === options[0].value) {
                    return {
                        custom: true,
                        content: `<@&${o.value}> is already part of this menu.`,
                        allowedMentions: {
                            roles: [],
                        },
                        ephemeral: true,
                    }
                }
            }

            menu.addOptions(options)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                  .setCustomId('auto_roles')
                  .setMinValues(0)
                  .setMaxValues(1)
                  .setPlaceholder('select your roles')
                  .addOptions({
                    description: (options)
                  })
            )
        }

        targetMessage.edit({
            components: [row]
        })

        return {
            custom: true,
            content: `added <@&${role.id}> to the auto roles now.`,
            allowMentions: {
                roles: []
            },
            ephemeral: true
        }
    },
}
