const {
    Permissions,
    Constants,
    MessageSelectMenu,
    MessageActionRow,
} = require("discord.js")

module.exports = {
    name : "addrole",
    description : "Adds a role to the auto role message.",
    permissions : [Permissions.FLAGS.ADMINISTRATOR],
    slash : true,
    options : [
        {
            name : "channel",
            description : "Specify a channel",
            type : Constants.ApplicationCommandOptionTypes.CHANNEL,
            required : true
        },
        {
            name : "messageId",
            description : "Enter a messageId",
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : "role",
            description : "Select a role",
            type : Constants.ApplicationCommandOptionTypes.ROLE,
            required : true
        }
    ],
    
    async init(client) {
        client.on("interactionCreate", async (interaction) => {
            if(!interaction.isSelectMenu) return;
            
            const { customId, values, member } = interaction
            if(customId === "auto_roles") {
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })
                
                for (const id of removed) {
                    member.roles.remove(id.value)
                }
                
                for (const id of values) {
                    member.roles.add(id)
                }
                
                interaction.reply({
                    content : "Role Updated",
                    ephemeral : true
                })
            }
        })
    },
    
    async execute({ interaction, client }) {
        const channel = interaction.options.getChannel("channel")
        if(!channel) return interaction.reply({
            content : "please tag a text channel",
            ephemeral : true
        })
        
        const messageId = interaction.options.getString("messageId")
        const targetMessage = await channel.messages.fetch(messageId)
           .catch(() => null)
        
        if (!targetMessage) {
            return interaction.reply({
                content : "Unknown message id",
                ephemeral : true
            })
        }
        
        if(targetMessage.author.id !== client.user?.id) return interaction.reply({
            content : `Please provide a message ID that was sent from <@${client.user?.id}>`,
            ephemeral : true
        })
        
        let row = targetMessage.components[0]
        if(!row) {
            row = new MessageActionRow()
        }
        
        const option = [
            {
                label : role.name,
                label : role.id
            }
        ]
        
        let menu = row.components[0]
        if(menu) {
            for (const o of menu.options) {
                if(o.value === option[0].value) {
                    return interaction.reply({
                        content : `<@&${o.value}> is already part of this menu.`,
                        ephemeral : true,
                        allowedMentions : {
                            roles : []
                        }
                    })
                }
            }
            
            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId("auto_roles")
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceholder("select your roles...")
                .addOptions(option)
            )
        }
        
        targetMessage.edit({
            components : [row]
        })
        
        if(interaction) {
            interaction.reply({
                content : `Added <@&${role.id}> to the auto roles menu.`,
                ephemeral : true,
                allowedMentions : {
                    roles : []
                }
            })
        }
    }
}
