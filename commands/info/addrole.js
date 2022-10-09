const { Command , CommandMode } = require("sdhandler")
const { Constants , Permissions , MessageSelectMenu , MessageActionRow } = require("discord.js")
const prefix = 'auto_roles'

module.exports = new Command({
    name : 'setRoles',
    description : 'Set the role to the message',
    mode : CommandMode.Slash,
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    options : [
        {
            name : 'message_link',
            description : 'Paste the message link here',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : 'role',
            description 'Mention a specific role you want ex: "@role", etc.',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : 'emoji',
            description : 'Put whatever emoji you want',
            type : Constant.ApplicationCommandOptionTypes.STRING,
            required : false
        },
        {
            name : "placeholder",
            description : 'Type any placeholder name like "select your roles"',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        }
    ],
    
    async init(client) {
        client.on('interactionCreate', async interaction => {
            if(!interaction.isSelectMenu()) {
                return
            }
            
            const { guild , customId } = interaction
            if(!guild || !customId.startsWith(prefix)) {
                return
            }
            
            const roleId = customId.replace(prefix , '')
            const member = interaction.member
            
            if(member.roles.cache.has(roleId)) {
                member.roles.remove(roleId)
                
                interaction.reply({
                    content : `You no longer have <@&${roleId}> role`,
                    ephemeral : true
                })
            } else {
                member.roles.add(roleId)
                
                interaction.reply({
                    content : `You now have <@&${roleId}> role`,
                    ephemeral : true
                })
            }
        })
    },
    
    async execute({ interaction , options , client }) {
        const link = options.getString("message_link", true)
        const stuff = link.split("/")
        const channelID = stuff.pop()
        const messageID = stuff.pop()
        const channel = interaction.guild.channels.get(channelID)
        if(!link || !channel) return interaction.reply({
            content : "Invalid Link\n", "nice try breaking my bot -migzchi#9798",
            ephemeral : true
        })
        
        const emoji = interaction.options.getString("emoji")
        if(!emoji) return interaction.reply({
            content : "Invalid emoji please try again later.",
            ephemeral : true
        })
        
        const placeHolder = interaction.options.getString("placeholder", true)
        if(!placeHolder) return interaction.reply({
            content : "Invalid PlaceHolder",
            ephemeral : true
        })
        
        const role = option.getRole("role", true)
        if(!role) return interaction.reply({
            content : "Unknown role",
            ephemeral : true
        })
        
        const targetMessage = await channel.messages.fetch(messageID, {
            cache : true,
            force : true
        })
        
        if(!targetMessage) return interaction.reply({
            content : "Unknown message ID",
            ephemeral : true
        })
        
        if(targetMessage.author.id !== client.user?.id) {
            return interaction.reply({
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
                value : role.id
                emoji : { name : emoji.name , id : emoji.id }
            }
        ]
        
        let menu = row.components[0]
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
            
            menu.addOptions(options)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId(`${prefix}${roleId}`)
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceHolder(placeHolder)
                .addOptions(options)
            )
        }
        
        targetMessage.edit({
            components : [row]
        })
        
        if(interaction) {
            interaction.reply({
                content : `added <@&${role.id}> to the menu`,
                ephemeral : true
            })
        }
    }
})
