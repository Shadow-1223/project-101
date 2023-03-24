import mongoose from "mongoose"
import { GatewayIntentBits, Client, ActivityType } from "discord.js"
import { Sern, single, DefaultLogging } from "@sern/handler"
require("dotenv").config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent, // Make sure this is enabled for text commands!
	],
});

export const useContainer Sern.makeDependencies({
    build: root => root
        .add({ '@sern/client': single(() => client)  })
        .upsert({ '@sern/logger': single(() => new DefaultLogging()) })
});


client.on('ready', async () => {
    await mongoose.connect(
        process.env.MONGO_URI ,
        {
            keepAlive : true
        }
    )
    console.log("the bot is online")
    //set activity of the bot.
    client.user.setActivity("ka help (its now online thank you for your patience)", { type : ActivityType.Competing })
})

Sern.init({
    defaultPrefix : 'ka',
    commands : 'src/commands',
    events : 'src/events',
    containerConfig : {
	    get: useContainer
    }
})
client.login(process.env.token)
