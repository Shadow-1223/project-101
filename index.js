require('dotenv').config();

const { SDClient } = require('sdhandler')
const mongoose = require('mongoose')

const { Intents, Client } = require('discord.js')

const client = new Client({
  // These intents are recommended for the built in help menu
  intents : [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_PRESENCES
  ],
})

client.on('ready', async () => {
  await mongoose.connect(
    process.env.MONGO_URI,
    {
      keepAlive: true
    }
    )
  // Set the client user's activity
client.user.setActivity('ka help', { type: 'WATCHING' });
})

new SDClient({
    token : process.env.TOKEN, // Your Bot's token
    intents : [client] , // An Array of Intents
    commandsDir : "./commands", // The directory which contains command files .Default is "commands"
    eventsDir : "./events", // The directory which contains event files .Default is "events"
    testOnly : false, // Toggle this to true if you want to register in specific test servers . Default is "false"
    prefix : ["ka "], // An Array of Prefixes for your bot. Default is "!"
    guildId : [], // An Array of IDs of Test servers
    compileFolder : "compile-folder-name" // ONLY for Typescript Projects. Specify your compile folder(out-dir)
})
