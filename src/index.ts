import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js"
import { Sern, Singleton, single, Dependencies, DefaultLogging } from "@sern/handler"
import mongoose from "mongoose"
import "dotenv/config"

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
    
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.GuildMember,
    ]
})

interface MyDependencies extends Dependencies {
	'@sern/client': Singleton<Client>;
	'@sern/logger': Singleton<DefaultLogging>;
}

export const useContainer = Sern.makeDependencies<MyDependencies>({
    build: (root) => 
            root.add({ "@sern/client": single(() => client) })
               .upsert({ "@sern/logger": single(() => new DefaultLogging()) })
})

Sern.init({
    defaultPrefix: "karni ",
    commands: "./dist/commands",
    events: "./dist/events",
    containerConfig: {
        get: useContainer
    }
})

client.on("ready", async () => {
    await mongoose.connect(
        process.env.MongoUri!,
        {
            keepAlive: true,
        }
    )
    
    client.user?.setActivity("ka help", { type: ActivityType.Competing })
    console.log(`{client.user.username} is online!`)
})

client.login(process.env.Token)
