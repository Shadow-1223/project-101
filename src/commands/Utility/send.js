const { 
    AttachmentBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    Modal, 
    TextInputComponent, 
    ButtonBuilder, 
} = require("discord.js")
const { codeBlock } = require("@discordjs/builders")
const EmbedDB = require("../../Other/schemas/embed.js")

module.exports = {
    name : "embeds" ,
    description : "Create a Message Embed" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    slash : true,
    options : [
        {
            name : "create",
            description : "Create an embed.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "channel",
                    description : "specify a channel",
                    type : Constants.ApplicationCommandOptionTypes.CHANNEL,
                    required : true
                }
            ]
        },
        {
            name : "edit",
            description : "Edit a embed.",
            type : Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
            options : [
                {
                    name : "messageid",
                    description : "Enter a message id",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        }
    ],
    
    async execute({ interaction , client }) {
        const embedModals = new Modal()
          .setTitle("Create Embeds")
          .setCustomId("embeds")
          .addComponents(
             new MessageActionRow({
                  components : [
                      new TextInputComponent()
                          .setCustomId("title")
                          .setLabel("What should be the title?")
                          .setPlaceholder("Give me some interesting title? (optional)")
                          .setStyle("SHORT")
                  ]
              }),
              
              new MessageActionRow({
                  components : [
                      new TextInputComponent()
                          .setCustomId("description")
                          .setLabel("What should be the description?")
                          .setPlaceholder("Interesting description for the embeds? (required)")
                          .setStyle("PARAGRAPH")
                  ]
              }),
              
              new MessageActionRow({
                  components : [
                      new TextInputComponent()
                          .setCustomId("attachment")
                          .setLabel("What image will you put?")
                          .setPlaceholder("What kind of sus image will put? (optional)")
                          .setStyle("PARAGRAPH")
                  ]
              }),
              
              new MessageActionRow({
                  components : [
                      new TextInputComponent()
                          .setCustomId("color")
                          .setLabel("What should be the color?")
                          .setPlaceholder("hex color code (optional)")
                          .setStyle("SHORT")
                  ]
              })
          )
          
        await interaction.showModal(embedModals)
        
        const query = interaction.options.getSubcommand()
        
        if(query === "create") {
            const filter = (interaction) => interaction.customId === "embeds";
            const modalsInteraction = await interaction.awaitModalSubmit({ filter, time : 40_000 })
              .catch(console.error)
                
            if(modalsInteraction) {
                const title = modalsInteraction?.fields.getTextInputValue("title")
                const description = modalsInteraction?.fields.getTextInputValue("description")
                const att = modalsInteraction?.fields.getTextInputValue("attachment")
                const color = modalsInteraction?.fields.getTextInputValue("color")
                const channel = interaction.options.getChannel("channel")
                    
                const embedObj = {
                    title : title,
                    description : description,
                    channelID : channel.id
                }
                    
                const embedDb = new EmbedBuilder(embedObj).save();
                const attach = new MessageAttachment(att)
                const createEmbed = new MessageEmbed()
                .setDescription(description)
                if(title) createEmbed.setTitle(title)
                try {
                    createEmbed.setColor(color)
                } catch {
                    createEmbed.setColor("#2f3136")
                }
                    
                channel.send({ embeds : [createEmbed] })
                await modalsInteraction.reply({
                    content : `The embeds has been sent in ${channel}`,
                    ephemeral : true
                })
            }
        } else if(query === "edit") {
            const filter = (interaction) => interaction.customId === "embeds";
            const modalsInteraction = await interaction.awaitModalSubmit({ filter, time : 40_000 })
              .catch(console.error)
              
            if(modalsInteraction) {
                const messageId = interaction.options.getString("messageId")
                
                const titl = modalsInteraction?.fields.getTextInputValue("title")
                const desc = modalsInteraction?.fields.getTextInputValue("description")
                const att = modalsInteraction?.fields.getTextInputValue("attachment")
                const color = modalsInteraction?.fields.getTextInputValue("color")
                const targetMessage = await interaction.channel.messages.fetch(messageId, {
                    cache : true,
                    force : true
                })
                
                if(!targetMessage) return interaction.reply({
                    content : "Unknown Message ID.",
                    ephemeral : true
                })
                
                if(targetMessage.author.id !==  client.user?.id) {
                    return interaction.reply({
                        content : `Please provide a messageID that was sent <@${client.user?.id}>`,
                        ephemeral : true
                    })
                    
                    const attach = new MessageAttachment(att)
                    const editEmbed = new MessageEmbed()
                     if(titl) editEmbed.setTitle(titl)
                     .setDescription(desc)
                     try {
                         editEmbed.setColor(color)
                     } catch {
                         editEmbed.setColor("#2f3136")
                     }
                     
                     targetMessage.edit({ embeds : [editEmbed] })
                     await modalsInteraction.reply({
                         content : `Successfully edit the embeds`,
                         ephemeral : true
                     })
                }
            }
        }
    }
}
