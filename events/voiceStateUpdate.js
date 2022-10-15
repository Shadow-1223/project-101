const { Collection } = require("discord.js")
const { Event } = require("sdhandler")
const voiceCollection = new Collection()

module.exports = new Event("voiceStateUpdate", async ( oldState , newState ) => {
    const user = client.users.fetch(newState.id)
    const member = newState.guild.member(user)
    
    if(!oldState.channel && newState.channel.id === "1030821612427149363") {
        const channel = await newState.guild.channels.create(`${user.username}'s channel`, {
            type : "voice",
            parent : newState.channel.parent
        })
        member.voice.setChannel(channel)
        voiceCollection.set(user.id , channel.id)
    } else if(!newState.channel) {
        if(oldState.channelID === voiceCollection.get(newState.id))
          return oldState.channel.delete()
    }
})
