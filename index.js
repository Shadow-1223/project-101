require('dotenv/config')

const { SDClient } = require('sdhandler')
const mongoose = require('mongoose')
const { Intents, Client } = require('discord.js')

const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCE,
        Intents.FLAGS.MESSAGE_CONTENT,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_EMOJI_AND_STICKERS,
    ]
})

client.on("ready", async () => {
    await mongoose.connect(
        process.env.MONGO_URI,
        {
            keepAlive : true
        }
    )
    //set activity of the bot.
    client.user.setActivity("ka help (its now online thank you for your patience)", { type : "STREAMING" })
})

new SDClient({
    token : process.env.TOKEN, // Your Bot's token
    intents : client.options.intents , // An Array of Intents
    commandsDir : "./commands", // The directory which contains command files .Default is "commands"
    eventsDir : "./events", // The directory which contains event files .Default is "events"
    testOnly : false, // Toggle this to true if you want to register in specific test servers . Default is "false"
    prefix : ["ka "], // An Array of Prefixes for your bot. Default is "!"
    guildId : [], // An Array of IDs of Test servers
    compileFolder : "compile-folder-name" // ONLY for Typescript Projects. Specify your compile folder(out-dir)
})
