const { Constants, Permissions, MessageActionRow, MessageSelectMenu } = require("discord.js")
const prefix = 'auto_roles'

module.exports = {
    name : 'addrole',
    description : 'add a role to the menu',
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    requiredRoles : ['985756703087788062' , '986179620640550952'],
    options : [
        {
            name : 'message_link',
            description : 'Enter message link',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : 'role',
            description : 'Enter role in this options',
            type : Constants.ApplicationCommandOptionTypes.ROLE,
            required : true
        }
    ],
    
    async init(client) {
        client.on('interactionCreate', async (interaction) => {
            if(!interaction.isSelectMenu()) {
                return;
            }
            
            const { guild, customId } = interaction
            if(!guild || !customId.startsWith(prefix)) {
                return;
            }
            
            const roleId = customId.replace(prefix, '')
            const member = interaction.member
            
            if(member.roles.cache.has(roleId)) {
                member.roles.remove(roleId)
                
                interaction.reply({
                    content : `You no longer have <@&${roleId}> role`
                })
            } else {
                member.roles.add(roleId)
                
                interaction.reply({
                    content : `You now have <@&${roleId}> role`
                })
            }
        })
    },
    
    slash : true,
    async execute({ interaction , message , client }) {
        if(message) return message.reply({
            content : 'this command does not have legacy cmd on',
            allowedMentions : {
                repliedUser : false
            }
        })
        
        const link = interaction.options.getString('message_link', true)
        const stuff = link.split('/')
        const messageID = stuff.pop()
        const channelID = stuff.pop()
        const channel = interaction.guild.channels.cache.get(channelID)
        if(!link) return interaction.reply({
            content : 'invalid link',
            ephemeral : true
        })
        
        const role = interaction.options.getRole("role", true) 
        if(!role) {
            return interaction.reply({
                content : 'Unknown role',
                ephemeral : true
            })
        }
        
        const targetMessage = await channel.messages.fetch(messageID, {
            cache : true,
            force : true
        })
        
        if(!targetMessage) return interaction.reply({
            content : 'Unknown message ID',
            ephemeral : true
        })
        
        if(targetMessage.author.id !== client.user?.id) {
            return interaction.reply({
                content : `Please provide a message ID that was sent ${client.user?.id}`,
                ephemeral: true
            })
        }
        
        let row = targetMessage.components[0]
        if(!row) {
            row = new MessageActionRow()
        }
        
        const options = [
            {
                label : role.name,
                value : role.id
            }
        ]
        
        let menu = row.components[0]
        if(menu) {
            for (const o of menu.options) {
                if(o.value === options[0].value) {
                    return interaction.reply({
                        content : `<@&${o.value}> is already part of this menu`,
                        allowedMentions : {
                            roles : [],
                        },
                        ephemeral: true
                    })
                }
            }
            
            menu.addOptions(options)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId(`${prefix}${roleId}`)
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceholder("select your role")
                .addOptions(options)
            )
        }
        
        targetMessage.edit({
            components : [row]
        })
        
        if(interaction) {
            interaction.reply({
                content : `added <@&${role.id}> to the menu`,
                allowedMentions : {
                    roles : []
                },
                ephemeral : true
            })
        }
    }
}
