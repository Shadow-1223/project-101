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
const EmbedDB = require("../src/Other/schemas/embed.js")

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
                    type ApplicationCommandOptionType.String,
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
                
                const createSave = new EmbedDB(embedObj).save();
                const attach = new AttachmentBuilder(att. { name: "test.png"}) || ""
                const createEmbed = new EmbedBuilder();
                  if(titl) createEmbed.setTitle(titl)
                  .setDescription(text)
                  try {
                      createEmbed.setImage(attach)
                      createEmbed.setColor(color)
                  } catch {
                      createEmbed.setImage(null)
                      createEmbed.setColor("#2f3136")
                  }
                
                channel.send({ embeds: [createEmbed] })
                await modalsInt.reply({
                    content : `The embed has been sent in ${channel}.`,
                    ephemeral : true
                })
            },
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
                
                const editedObj = {
                    title : titl,
                    description : editText,
                    hexColor : color,
                    image : attachment
                }
                
                const editSave = new EmbedDB.
            }
        }
    }
})
