const { Constants, Permissions, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } = require("discord.js")

module.exports = {
    name : 'addrole',
    description : 'adds a role to the message',
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    requiredRoles : ['985756703087788062' , '986179620640550952'],
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : 'message_link',
            description : 'Enter message link',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : 'role',
            description : 'Type a role name in this options',
            type : Constants.ApplicationCommandOptionTypes.ROLE,
            required : true
        },
        {
            name : 'emoji',
            description : 'Paste the emoji ID in this options',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : false
        }
    ],
    
    async init(client) {
        client.on("interactionCreate", async (interaction) => {
            if(!interaction.isSelectMenu()) {
                return;
            }
            
            const { customId, values, member } = interaction;
            
            if(customId === 'auto_roles') {
                const component = interaction.component
                const removed = component.options.filter((options) => {
                    return !values.includes(options.value)
                })
                
                for (const id of removed) {
                    await member.roles.remove(id.value)
                }
                
                for (const id of values) {
                    await member.roles.add(id)
                }
                
                await interaction.reply({
                    content : `Gave you the <@&${role.id}> role`,
                    allowedMentions : {
                        roles : []
                    },
                    ephemeral : true
                })
            } else {}
        })
    },
    
    slash : true,
    async execute({message , interaction , client}) {
        if(message) return message.reply({
            content : 'This command does not work on legacy command. Please try use slash command',
            allowedMentions : {
                repliedUser : []
            }
        })
        
        const link = interaction.options.getString("message_link", true)
        const stuff = link.split("/")
        const channelID = stuff.pop()
        const messageID = stuff.pop()
        const channel = interaction.guild.channel.cache.get(channelID)
        
        const role = interaction.options.getRole("role", true)
        if(!role) {
            return interaction.deferReply({
                content : 'Unknown role',
                ephemeral : true
            })
        }
        
        const targetMessage = await channel.message.fetch(messageID, {
            cache : true,
            force : true
        })
        
        if(!targetMessage) {
            return interaction.deferReply({
                content : 'Unknown message ID',
                ephemeral : true
            })
        }
        
        if(targetMessage.author.id !== client.user?.id) {
            return interaction.deferReply({
                content : `Please provide a message ID that was sent <@${client.user?.id}>`,
                ephemeral : true
            })
        }
        
        let row = targetMessage.components[0]
        if(!row) {
            row = new MessageActionRow()
        }
        
        const options = [
            {
                label : role.name,
                value : role.id, 
                emoji : '',
            }
        ]
        
        let menu = row.components[0];
        if(menu) {
            for (const o of menu.options) {
                if(o.value === options[0].value) {
                    return interaction.reply({
                        content : `<@&${o.value}> is already part of this menu`,
                        allowedMentions : {
                            roles : []
                        },
                        ephemeral : true
                    })
                } 
            }
            
            menu.addOptions(options);
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId("auto_roles")
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceholder("select your roles")
                .addOptions(options)
            )
        }
        
        targetMessage.edit({
            components : [row]
        })
        
        if(interaction) {
            interaction.reply({
                content : `<@&${role.id}> has been added to the menu`,
                allowedMentions : {
                    roles: []
                },
                ephemeral : true 
            })
        }
    }
}
