const { Collection , Client } = require("discord.js")
const voiceCollection = new Collection()

module.exports = {
    name : "voiceStateUpdate" ,
    /**
     * @param ${Client} client
    */
    async run(client , oldState , newState ) {
        const user = await client.users.fetch(newState.id)
        const member = newState.guild.member(user)
        
        if(!oldState.channel && newState.channel.id === "1030821612427149363") {
            const channel = await newState.guild.channels.create(`${user.username}'s channel` , {
                type : "GUILD_VOICE" ,
                parent : newState.channel.parent
            })
            
            member.voice.setChannel(channel)
            voiceCollection.set(user.id , channel.id)
        } else if(!newState.channel) {
            if(oldState.channelID === voiceCollection.get(newState.id)) return oldState.channel.delete()
        }
    }
}
