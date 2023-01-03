const { MessageAttachment, MessageEmbed, MessageActionRow, Modal, TextInputComponent, Permissions, Constants } = require("discord.js")
const EmbedBuilder = require("../../Other/schemas/embed.js")

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
                    name : "message_link",
                    description : "Enter a message link",
                    type : Constants.ApplicationCommandOptionTypes.STRING,
                    required : true
                }
            ]
        }
    ],
    
    async execute({ interaction , options , client }) {
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
          
        interaction.showModal(embedModals)
        
        const query = options.getSubcommand()
        
        
        if(query === "create") {
            // Collect a modal submit interaction
            const filter = (interaction) => interaction.customId === 'modal';
            const modalsInteraction = await interaction.awaitModalSubmit({ filter, time: 15_000 })
              .then(interaction => console.log(`${interaction.customId} was submitted!`))
              .catch(console.error);
            
            if(modalsInteraction) {
                const title = modalsInteraction?.fields.getTextInputValue("title")
                const description = modalsInteraction?fields.getTextInputValue("description")
                //let color;
                const channel = interaction.options.getChannel("channel")
                //const link = options.getString("message_link")
            
                
                const embeds = {
                    title : title,
                    description : description
                }
                
                const file = new MessageAttachment(attachment.url)
                const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                //.setColor(color)
            
               channel.send({ embeds : [embed] })
            
                
                const embedDB = new EmbedBuilder(embeds).save()
                
                modalsInteraction.reply({
                    content : "the embeds has been submited",
                    ephemeral : true
                })
            }
            
        } else if(query === "edit") {
            const link = interaction.options.getString("message_link")
            const stuff = link.split("/")
            const messageID = stuff.pop()
            const channelID = stuff.pop()
            const channel = interaction.guild.channels.cache.get(channelID)
            const invalid = "```\n" + link + "```"
            if(!link && !channel) return interaction.reply({
                content : `There is an invalid link you sent. \n ${inavlid}`
            })
            
            const targetMessage = await channel.messages.fetch(messageID, {
                force : true,
                cache : true
            })
            
            if(!targetMessage) return interaction.reply({
                content : "Unknown messageID",
                ephemeral : true
            })
            
            if(targetMessage.author.id !== client.user?.id) {
                return interaction.reply({
                    content : `Please provide a messageID that was sent <@${client.user?.id}>`,
                    ephemeral : true
                })
            };
            
            const title = interaction.fields.getTextInputValue("title")
            const description = interaction.fields.getTextInputValue("description")
            const attachment = interaction.fields.getTextInputValue("attachment")
            const color = interaction.fields.getTextInputValue("color")
            
            let embedBuilder = await EmbedBuilder.findOne(link)
            
            const att = new MessageAttachment(attachment)
            const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            
            link.edit({ embeds : [embed], files : [att] })
            
            if(link) return interaction.reply({
                content : "The embeds has been edited.",
                ephemeral : true
            })
        }
    }
}
