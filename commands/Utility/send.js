const { 
    MessageAttachment, 
    MessageEmbed, 
    MessageActionRow, 
    Modal, 
    TextInputComponent, 
    MessageButton, 
    Permissions, 
    Constants 
} = require("discord.js")
const { codeBlock } = require("@discordjs/builders")
const EmbedBuilder = require("../../Other/schemas/embed.js")
const row = new MessageActionRow()
 .addComponents(
     new MessageButton()
    .setCustomId("errDel")
    .setLabel("Delete?")
    .setEmoji("1060554179258634251")
    .setStyle("DANGER")
)

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
        const filter = i => i.customId === "errDel";
        const collector = interaction.channel.createMessageComponentCollector({ filter, time : 20000 })
        collector.on("collect", async i => {
            await i.update({ embeds : [] , components : [] })
        })
        
        collector.on("end", async collected => interaction.reply({
                content : `Successfully deleted the embeds! and collect the ${collected.size}`,
                ephemeral : true
            })
        )
        
        if(query === "create") {
            
            try {
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
                    .setTitle(title)
                    .setColor(color)
                    
                    channel.send({ embeds : [createEmbed] })
                    await modalsInteraction.reply({
                        content : `The embeds has been sent in ${channel}`,
                        ephemeral : true
                    })
                }
                
            } catch(err) {
                
                const errEmbed = new MessageEmbed()
                .setTitle("⚠️ | Error Alert!")
                .setDescription(codeBlock(err))
                .setColor("RED")
                
                await interaction.reply({
                    embeds : [errEmbed],
                    components : [row]
                })
            }
            
        } else if(query === "edit") {
            try {
                const filter = (interaction) => interaction.customId === "embeds";
                const modalsInteraction = await interaction.awaitModalSubmit({ filter, time : 40_000 })
                  .catch(console.error)
            
                if(modalsInteraction) {
                    const messageId = interaction.options.getString("messageid")
                
                    const title = modalsInteraction?.fields.getTextInputValue("title")
                    const description = modalsInteraction?.fields.getTextInputValue("description")
                    const attachment = modalsInteraction?.fields.getTextInputValue("attachment")
                    const color = modalsInteraction?.fields.getTextInputValue("color")
                    const targetMessage = await channel.messages.fetch(messageId, {
                        force : true,
                        cache : true
                    })
                
                    if(!targetMessage) return interaction.reply({
                        content : "Unknown message ID",
                        ephemeral : true
                    })
                
                    if(targetMessage.author.id !== client.user?.id) {
                        return interaction.reply({
                            content : `Please provide a messageID that was sent <@${client.user?.id}>`,
                            ephemeral : true
                        })
                    }
                
                    const att = new MessageAttachment(attachment)
                    const editEmbed = new MessageEmbed()
                     .setTitle(title)
                     .setDescription(description)
                     .setColor(title)
                
                    targetMessage.edit({ embeds : [editEmbed] })
                    await modalsInteraction.reply({
                        content : `Successfully edit the embed!`,
                        ephemeral : true
                    })
                }
            } catch(err) {
                
                const errEmbed = new MessageEmbed()
                .setTitle("⚠️ | Error Alert!")
                .setDescription(codeBlock("js", err))
                .setColor("RED")
                
                await interaction.followUp({
                    embeds : [errEmbed],
                    components : [row]
                })
            }
        }
    }
}
