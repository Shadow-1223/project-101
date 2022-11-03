require('dotenv/config')

const sdhandler = require('sdhandler')
const mongoose = require('mongoose')
const { GatewayIntentBits , Client } = require('discord.js')

const client = new Client({
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresence,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
    ]
})

client.on("ready", async () => {
    await mongoose.connect(
        process.env.MONGO_URI ,
        {
            keepAlive : true
        }
    )
    //set activity of the bot.
    client.user.setActivity("ka help (its now online thank you for your patience)", { type : "STREAMING" })
})

sdhandler.sdhandler({
    client : client ,
    commandsDir : "./commands" ,
    eventsDir : "./events" ,
    token : process.env.TOKEN ,
    prefix : ["ka "] ,
    buttonsDir : "./buttons"
})
