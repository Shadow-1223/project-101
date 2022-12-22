const { MessageEmbed, MessageActionRow, Modal, TextInputComponent, Permissions, Constant } = require("discord.js")

module.exports = {
    name : "setup_embeds" ,
    description : "Create a Message Embed" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES],
    type : Constants.ApplicationCommandTypes.CHAT_INPUT
    slash : true,
    options : [
        {
            name : " create embeds",
            description : "Create an embed.",
            type : Constants.ApplicationCommandOptionTypes.SUBCOMMAND,
        },
        {
            name : "edit",
            description : "Edit a embed.",
            type : CONSTANTS.APPLICATIONCOMMANDOPTIONTYPES.SUB_COMMAND,
        }
    ],
    
    async init(client) {
        client.on("interactionCreate", async (interaction) => {
            if()
        })
    },
    
    async execute({ interaction , options , message }) {
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
                          .setMinValues(10)
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
                          .setPlaceholder("hex color code ()")
                  ]
              })
          )
          
        return interaction.showModal(modal)
    }
}
