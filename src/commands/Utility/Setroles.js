const { Permissions , Constants , MessageSelectMenu , MessageActionRow } = require("discord.js")
const prefix = "auto_roles"
 
 module.exports = {
     name : "setroles2" ,
     description : "Set a role in the messages" ,
     permission : [Permissions.FLAGS.ADMINISTRATOR] ,
     type : Constants.ApplicationCommandTypes.CHAT_INPUT ,
     slash : true ,
     options : [
         {
             name : "channel" ,
             description : "Specify a channel" ,
             type : Constants.ApplicationCommandOptionTypes.CHANNEL ,
             required : true ,
         },
         {
             name : "messageId" ,
             description : "Enter a messageId" ,
             type : Constants.ApplicationCommandOptionTypes.STRING ,
             required : true
         },
         {
             name : "roles" ,
             description : "Select a role" ,
             type : Constants.ApplicationCommandOptionTypes.ROLE ,
             required : true
         }
    ],
    
    async init(client) {
        client.on("interactionCreate", interaction => {
            if(!interaction.isSelectMenu()) return;
            
            const { customId, values, member } = interaction;
            if(customId === "auto_roles") {
                const component = interaction.component;
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
                    content : "Roles updated",
                    ephemeral : true
                })
            }
        })
    },
     
    async execute({ interaction, client }) {
        console.log(execute)
        const channel = interaction.options.getChannel("channel")
        if(!channel || channel.types !== "GUILD_TEXT") {
            return interaction.reply({
                content : "please tag a text channel"
            })
        }
        
        const messageId = interaction.options.getString("messageId")
        const role = interaction.options.getRole("role")
        if(!role) {
            return interaction.reply({ content : "Unknown role" })
        }
        
        const targetMessage = await channel.messages.fetch(messageId, {
            cache : true,
            force : true,
        })
        
        if(!targetMessage) {
            return interaction.reply({ content : "Unknown messageID" })
        }
        
        if (targetMessage.author.id !== client.user?.id) {
            return interaction.reply({ content : `Please provide a message ID that was sent from <@${client.user?.id}>` })
        }
        
        let row = targetMessage.components[0]
        if (!row) {
            row = new MessageActionRow()
        }
        
        const option = [
            {
                label: role.name,
                value: role.id,
            },
        ]
        
        let menu = row.components[0]
        if (menu) {
            for (const o of menu.options) {
                if (o.value === option[0].value) {
                    return interaction.reply({
                        content: `<@&${o.value}> is already part of this menu.`,
                        allowedMentions: {
                            roles: [],
                        },
                        ephemeral: true,
                    })
                }
            }
            
            menu.addOptions(option)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                  .setCustomId('auto_roles')
                  .setMinValues(0)
                  .setMaxValues(1)
                  .setPlaceholder('Select your roles...')
                  .addOptions(option)
            )
        }

        targetMessage.edit({
            components: [row],
        })

        interaction.reply({
            content: `Added <@&${role.id}> to the auto roles menu.`,
            allowedMentions: {
                roles: [],
            },
            ephemeral: true,
        })
     }
 }
