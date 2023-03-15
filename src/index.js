const mongoose = require('mongoose')
const { Sern , single } = require("@sern/handler")
const { GatewayIntentBits, Events, Client } = require('discord.js') 
require("dotenv/config")

const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReaction,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMember,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildVoiceStates
    ]
})

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

client.login(process.env.TOKEN)
