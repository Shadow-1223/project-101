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
            const modalsInteraction = interaction.awaitModalSubmit({ filter, time: 40_000 })
            if(modalsInteraction) {
                const titl = interaction.fields.getTextInputValue("title")
                const text = interaction.fields.getTextInputValue("desc")
                const color = interaction.fields.getTextInputValue("color")
                const att = interaction.fields.geyTextInputValue("attachment")
                const channel = interaction.options.getChannel("channel")
                const embedObj = {
                    title : titl,
                    description : text,
                    channelID 
                }
                
            }
        } else if(query === "edit") {}
    }
})
