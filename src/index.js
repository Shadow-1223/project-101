require('dotenv').config()

const sdhandler = require('sdhandler')
const mongoose = require('mongoose')
const { Intents , Client } = require('discord.js') 

const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS ,
        Intents.FLAGS.GUILD_MESSAGES ,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS ,
        Intents.FLAGS.GUILD_PRESENCES ,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS ,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS ,
        Intents.FLAGS.GUILD_VOICE_STATES
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
    prefix : ["ka ", " "] ,
    buttonsDir : "./buttons"
})
