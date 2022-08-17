const DiscordJS = require('discord.js')
const sdhandler = require('sdhandler')
const fetch = require('node-fetch')
const mongoose = require('mongoose')
require('dotenv').config();

const { Intents } = DiscordJS

const client = new DiscordJS.Client({
  // These intents are recommended for the built in help menu
  intents : [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_PRESENCES
  ],
})

client.on('messageCreate', async (message) => {
  if(message.channel.id === '831883601942544454') {
        fetch.default(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
        .then(res => res.json())
        .then(data => {
            message.channel.send(data.response)
        })
    }
})

client.on('ready', async () => {
  await mongoose.connect(
    process.env.MONGO_URI,
    {
      keepAlive: true
    }
    )
  client.user.setPresence({activities: [{name: 'currently in fixing bugs'}], status: 'do not disturb', type: 'GAMING'})
})

sdhandler.sdhandler({
  client : client , //Supply the Client Object 
  commandsDir : "./commands", // (Optional) The relative path to your commands folder. If nothing is provided ./commands will be taken by default
  eventsDir : "./events" , // (Optional) The relative path to your events folder . If nothing is provided ./events will be taken by default
  token: process.env.TOKEN ,
  prefix : ['ka '] , // (Optional) The prefix(es) of your Bot (For legacy commands). Default is ["!"] .
  buttonsDir : "./buttons", // (Optional) The relative path to your buttons folder. If nothing is provided , ./buttons will be taken by default
})
