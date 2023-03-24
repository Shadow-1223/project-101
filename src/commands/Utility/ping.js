const { CommandType , commandModule } = require("@sern/handler")
const { EmbedBuilder } = require("discord.js")
const { inlineCode } = require("@discordjs/builders")
const { publish } = require("#plugins")

module.exports.defualt = commandModule({
    type : CommandType.Both,
    plugins : [publish()]
    description : "Replied with a pong",
    alias : ["p"],
    execute: async (ctx, args) => {
        const { client } = ctx
        const pingTime = new Date() - args.createdTimestamp 
        const pingRound = Math.round(client.ws.ping)
        const inline = new inlineCode(`${pingTime}ms`)
        const line = new inlineCode(`${pingRound}ms`)
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
                    name : "Api:",
                    value : `${line}`
                }
            ]
        )
        
        ctx.send({ embeds : [pingEmbed] })
    }
})
