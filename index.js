require('dotenv/config')

const sdhandler = require('sdhandler')
const mongoose = require('mongoose')
const { GatewayIntentBits , Client } = require('discord.js')

const client = new Client({
    intents : [
        GatewayIntentBits.GUILDS,
        GatewayIntentBits.GUILD_MESSAGES,
        GatewayIntentBits.GUILD_MESSAGES_REACTIONS,
        GatewayIntentBits.GUILD_PRESENCE,
        GatewayIntentBits.GUILD_BANS,
        GatewayIntentBits.GUILD_MEMBERS,
        GatewayIntentBits.GUILD_EMOJI_AND_STICKERS,
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
