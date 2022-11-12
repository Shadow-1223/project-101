const { Permissions , Constants , MessageSelectMenu , MessageActionRow } = require("discord.js")
const prefix = "auto_roles"
 
 module.exports = {
     name : "setroles" ,
     description : "Set a role in the messages" ,
     permission : [Permissions.FLAGS.ADMINISTRATOR] ,
     type : Constants.ApplicationCommandTypes.CHAT_INPUT ,
     slash : true ,
     options : [
         {
             name : "message_link" ,
             description : "Enter a message link" ,
             type : Constants.ApplicationCommandOptionTypes.STRING ,
             required : true ,
         },
         {
             name : "roles" ,
             description : "Select a specific role you wanna put on the selection menu" ,
             type : Constants.ApplicationCommandOptionTypes.ROLE ,
             required : true
         },
         /*{
             name : "placeholder" ,
             description : "Type a placeholder name" ,
             type : Constants.ApplicationCommandOptionTypes.STRING ,
             required : true
         },
         {
             name : "emoji" ,
             description : "Select a emoji you want" ,
             type : Constants.ApplicationCommandOptionTypes.STRING ,
             required : false ,
         }*/
    ],
    
    async init(client) {
        client.on("interactionCreate", async ( interaction ) => {
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
                    content : `You no longer have <@&${roleId}> roles` ,
                    ephemeral : true
                })
            } else {
                member.roles.add(roleId)
                
                interaction.reply({
                    content : `You now have <@&${roleId}> roles` ,
                    ephemeral : true
                })
            }
        })
    },
     
    async execute({ interaction , client }) {
        const link = interaction.options.getString("message_link" , true)
        const stuff = link.split("/")
        const messageID = stuff.pop()
        const channelID = stuff.pop()
        const channel = interaction.guild.channels.cache.get(channelID)
        if(!link || !channel) return interaction.reply({
            content : "Invalid link.\n Please don't some link are not real message link" ,
            ephemeral : true
        })
        
        /*const emoji = interaction.options.getString("emoji")
        if(!emoji) return interaction.reply({
            content : "Invalid emoji, please try again later" ,
            ephemeral : true
        })
        
        const placeHolder = interaction.options.getString("placeholder" , true)
        if(!placeHolder) return interaction.reply({
            content : "Invalid PlaceHolder name" ,
            ephemeral : true
        })*/
        
        const role = interaction.options.getRole("roles" , true)
        if(!role) return interaction.reply({
            content : "Unknown roles" ,
            ephemeral : true
        })
        
        const targetMessage = await channel.messages.fetch(messageID , {
            cache : true ,
            force : true
        })
        
        if(!targetMessage) return interaction.reply({
            content : "Unknown messageID" ,
            ephemeral : true
        })
        
        if(targetMessage.author.id !== client.user?.id) {
            return interaction.reply({
                content : `Please provide a messageID that was sent <@${client.user?.id}>` ,
                ephemeral : true
            })
        }
        
        let row = targetMessage.components[0]
        if(!row) {
            row = new MessageActionRow()
        }
        
        const options = [
            {
                label : role.name ,
                value : role.id ,
                //emoji : { name : "" , id : "" }
            }
        ]
        
        let menu = row.components[0]
        if(menu) {
            for (const o of menu.options) {
                if(o.value === options[0].value) {
                    return interaction.reply({
                        content : `<@&${o.value}> is already part of this menu` ,
                        allowedMentions : {
                            roles : []
                        } ,
                        ephemeral : true
                    })
                }
            }
            
            menu.addOptions(options)
            menu.setMaxValues(menu.options.length)
        } else {
            row.addComponents(
                new MessageSelectMenu()
                .setCustomId(`${prefix}${role.id}`)
                .setMinValues(0)
                .setMaxValues(1)
                .setPlaceHolder(`select ypur roles`)
                .addOptions(options)
            )
        };
        
        targetMessage.edit({
            components : [row]
        })
        
        if(interaction) {
            interaction.reply({
                content : `added <@&${role.id}> to the menu` ,
                ephemeral : true
            })
        }
    }
 }
