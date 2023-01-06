module.exports = {
    name : "interactionCreate",
    async run(interaction) {
        if(!interaction.isButton) return;
        
        if(interaction.customId.includes("errDel")) {
            return interaction.update({ embeds : [] })
        }
    }
}
