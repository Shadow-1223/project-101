const { VoiceState } = require("discord.js")

module.exports = {
    name : "voiceStateUpdate" ,
    /**
     * @param ${VoiceState} oldState
     * @param ${VoiceState} newState
    */
    async run(oldState , newState , client) {
        const { member , guild } = newState
        const oldChannel = oldState.channel
        const newChannel = newState.channel
        const joinToCreate = "1030821612427149363"
        
        if(oldChannel !== newChannel && newChannel && newChannel.id === joinToCreate) {
            const voiceChannel = await guild.channels.create(`${member.user.username}'s lounge` , {
                type : "GUILD_VOICE" ,
                parent : newChannel.parent ,
                permissionOverwrites : [
                    { id : member.id , allow : ["CONNECT"] } ,
                    { id : guild.id , deny : ["CONNECT"] }
                ]
            })
            
            client.voiceGenerator.set(member.id , voiceChannel.id)
            await newChannel.permissionOverwrites.edit(member , {CONNECT : false})
            setTimeout(() => newChannel.permissionOverwrites.delete(member) , 30 * 1000)
            
            return setTimeout(() => member.voice.setChannel(voiceChannel) , 500)
        }
    }
}
