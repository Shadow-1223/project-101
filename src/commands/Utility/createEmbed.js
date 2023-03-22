const {
    ModalBuilder,
    EmbedBuilder,
    TextInputStyle,
    TextInputBuilder,
    ActionRowBuilder,
    AttachmentBuilder,
    ApplicationCommandOptionType,
} = require("discord.js")
const { commandModule , CommandType } = require("@sern/handler")
const EmbedDB = require("../../Other/schemas/embed.js")

module.exports.defualt = commandModule({
    type : CommandType.Slash,
    plugins : [],
    description : "Embed maker",
    options : [
        {
            name : "create",
            description : "Create a Embed",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "channel",
                    description : "Enter a channel name",
                    type : ApplicationCommandOptionType.Channel,
                    required : true
                }
            ]
        },
        {
            name : "edit",
            description : "Edit a embed",
            type : ApplicationCommandOptionType.Subcommand,
            options : [
                {
                    name : "messageId",
                    description : "Enter a message id",
                    type : ApplicationCommandOptionType.String,
                    required : true
                }
            ]
        }
    ],
    execute: async ({interaction}) => {
        const query = interaction.options.getSubcommand()
        const embedModal = new ModalBuilder()
        .setTitle("Create Embed")
        .setCustomId("create_embed")
        .addComponents(
            new ActionRowBuilder({
                components : [
                    new TextInputBuilder
                    .setCustomId("title")
                    .setLabel("What should be the title?")
                    .setPlaceHolder("Type a interesting title")
                    .setStyle(TextInputStyle.Short)
                ],
            }),
            new ActionRowBuilder({
                components : [
                    new TextInputBuilder
                    .setCustomId("desc")
                    .setLabel("What should be the description?")
                    .setPlaceHolder("Type a any description")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                ],
            }),
            new ActionRowBuilder({
                components : [
                    new TextInputBuilder
                    .setCustomId("color")
                    .setLabel("What should be the title?")
                    .setPlaceHolder("Enter a color or rgb code")
                    .setStyle(TextInputStyle.Short)
                ],
            }),
            new ActionRowBuilder({
                components : [
                    new TextInputBuilder
                    .setCustomId("attachment")
                    .setLabel("What image you would like to show?")
                    .setPlaceHolder("Enter a image")
                    .setStyle(TextInputStyle.Paragraph)
                ],
            }),
        )
        
        await interaction.showModal(embedModal)
        
        if(query === "create") {
            const filter = (interaction) => interaction.customId === "create_modal"
            const createModalsInt = interaction.awaitModalSubmit({ filter, time: 40_000 })
            .catch(error => (null))
            
            if(createModalsInt) {
                const titl = interaction.fields.getTextInputValue("title")
                const text = interaction.fields.getTextInputValue("desc")
                const color = interaction.fields.getTextInputValue("color")
                const att = interaction.fields.geyTextInputValue("attachment")
                const channel = interaction.options.getChannel("channel")
                const embedSave = new EmbedDB(embedObj).save();
                const embedObj = {
                    title : titl,
                    description : text,
                    channelID : channel,
                    image : att
                }
                
                const imageBuffer = Buffer.from(att, "base64")
                const createSave = new EmbedDB(embedObj).save();
                const attach = new AttachmentBuilder(imageBuffer, { name: "test.png"}) || null
                const createImage = new EmbedBuilder()
                if(text) createImage.setDescription(null);
                try {
                    createImage.setImage(attach)
                    createImage.setColor(color)
                } catch {
                    createImage.setImage(null)
                    createImage.setColor(0x0099FF)
                }
            
                const createEmbed = new EmbedBuilder();
                  if(titl) createEmbed.setTitle(titl)
                  .setDescription(text)
                  try {
                      createEmbed.setColor(color)
                  } catch {
                      createEmbed.setColor(0x0099FF)
                  }
                
                channel.send({ embeds: [createEmbed] })
                await modalsInt.reply({
                    content : `The embed has been sent in ${channel}.`,
                    ephemeral : true
                })
            }
        } else if(query === "edit") {
            const filter = (interaction) => interaction.customId === "create_embed"
            const editModalsInt = await interaction.awaitModalSubmit({ filter, time : 40_000 })
            .catch(error => (null))
            
            if(editModalsInt) {
                const titl = interaction.fields.getTexInputValue("title")
                const editText = interaction.fields.getTextInputValue("desc")
                const color interaction.fields.getTextInputValue("color")
                const attachment = interaction.fields.getTextInputValue("attactment")
                const messageId = interaction.options.getString("messageId")
                const targetMessage = await interaction.channel.messages.fetch(messageId)
                if(!targetMessage) return interaction.reply({
                    content : "Unknown messageID",
                    ephemeral : true
                })
                
                const editedObj = {
                    _id : messageId,
                    title : titl,
                    description : editText,
                    hexColor : color,
                    image : attachment
                }
                
                const buffer = Buffer.from(attachment, "base64")
                const editSave = new EmbedDB.FindOneAndUpdate(editedObj._id, { $set: editedObj }, { upsert: true, new: true })
                const imageBuffer = new AttachmentBuilder(buffer, { name : "hello.png" }) | null
                const editedImage = new EmbedBuilder()
                if(editText) editedImage.setDescription(null)
                try {
                    editedImage.setImage(imageBuffer)
                    editedImage.setColor(color)
                } catch {
                    editedImage.setImage(null)
                    editedImage.setColor(0x0099FF)
                }
                
                const editedEmbed = new EmbedBuilder()
                if(titl) editedEmbed.setTitle(titl)
                .setDescription(editText)
                try {
                    editedEmbed.setColor(color)
                } catch {
                    editedEmbed.setColor(0x0099FF)
                }
                
                targetMessage.edit({ embeds : [editedEmbed] })
                await editModalsInt.reply({
                    content : "The embed has been edited!",
                    ephemeral : true
                })
            }
        }
    }
})
