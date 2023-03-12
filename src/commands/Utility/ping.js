const { CommandType , commandModule } = require("@sern/handler")
const { EmbedBuilder } = require("discord.js")
const { inlineCode } = require("discordjs/builders")

exports.defualt = new commandModule({
    type : CommandType.Both,
    description : "Replied with a pong",
    alias : ["p"]
    execute: async (ctx) => {
        const { client } = ctx
        const pingTime = new Date() - ctx.createdTimestamp
        const pingRound = Math.round(client.ws.ping)
        const inline = new inlineCode(`${pingTime}ms`)
        const line = new InlineCode(`${pingRound}ms`)
        const pingEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("🏓 | Pong!")
        .addFields(
            [
                {
                    name : "Lentacy:",
                    value : `${inline}`
                },
                {
                    name : "Api:"
                    value : `${line}`
                }
            ]
        )
        
        ctx.send({ embeds : [pingEmbed] })
    }
})