import { CommandType , commandModule } = require("@sern/handler")
import { EmbedBuilder } from "discord.js"
import { inlineCode } from "@discordjs/builders"
import { publish } from "#plugins"

export default commandModule({
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
