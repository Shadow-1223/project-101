const { MessageAttchment, MessageEmbed, MessageActionRow, Modal, TextInputComponent, Permissions, Constants } = require("discord.js")
//const EmbedBuilder = require("./Other/schemas/embed.js")

module.exports = {
    name : "embeds" ,
    description : "Create a Message Embed" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    type : Constants.ApplicationCommandTypes.CHAT_INPUT,
    slash : true,
    /*options : [
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
    ],*/
    
    async init(client) {
        client.on("interactionCreate", async (interaction) => {
            if(!interaction.isModalSubmit && !interaction.isCommand) return;
            
            if(interaction.customId === "embeds") {
                const title = interaction.fields.getTextInputValue("title"),
                      description = interaction.fields.getTextInputValue("description"),
                      attachment = interaction.fields.getTextInputValue("attachment") || "",
                      color = interaction.fields.getTextInputValue("color") || "#00000"
                
                const query = interaction.options.getSubcommand()

                const att = new MessageAttachment()
                const embed = new MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor(color)
                
                embed.send({ embeds : [embed], files : [att] })
            }
        })
    },
    
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
          
        return interaction.showModal(embedModals)
        
        //const query = options.getSubcommand()
        
        /*if(query === "create") {
            const channel = interaction.options.getChannel("channel")
            const link = options.getString("message_link")
            
            const embeds = {
                channelID : link
                title : title,
                description : description,
                image : attachment,
                hexColor : color
            }
            
            const embedDB = await new EmbedBuilder(embeds).save()
            
            const file = new MessageAttachment(attachment)
            const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            
            channel.send({ embeds : [embed], files : [file] })
            
            if(interaction) return interaction.reply({
                content : `The embed has benn sent in ${channel}`
                ephemeral : true
            })
        } else if(query === "edit") {
            const link = interaction.options.getString("message_link")
            const stuff = link.split("/")
            const messageID = stuff.pop()
            const channelID = stuff.pop()
            const channel = interaction.guild.channels.cache.get(channelID)
            if(!link && !channel) return interaction.reply({
                content : `There is an invalid link you sent. \n ```js ${link}`\``
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
            }
            
            const 
            
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
        }*/
    }
}
