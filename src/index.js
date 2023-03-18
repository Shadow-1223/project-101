const mongoose = require('mongoose')
const { GatewayIntentBits, Events, Client } = require('discord.js')
const { Sern, single, DefaultLogging } = require("@sern/handler")
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

const useContainer = Sern.makeDependencies({
    build: root => root
        .add({ '@sern/client': single(() => client)  })
        .upsert({ '@sern/logger': single(() => new DefaultLogging()) })
});

module.exports.defualt = { useContainer }

client.on('ready', async () => {
    await mongoose.connect(
        process.env.MONGO_URI ,
        {
            keepAlive : true
        }
    )
    //set activity of the bot.
    client.user.setActivity("ka help (its now online thank you for your patience)", { type : "STREAMING" })
})

Sern.init({
    defaultPrefix : 'ka ',
    commands : 'src/commands',
    events : 'src/events',
    containerConfig : {
	    get: useContainer
    }
})

client.login(process.env.token)
console.log(process.env)
