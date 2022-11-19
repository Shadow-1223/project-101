const { VoiceState , Collection } = require("discord.js")
const voiceGenerator = new Collection()

module.exports = {
    name : "voiceStateUpdate" ,
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
    */
    async run(client , oldState , newState) {
        const { member , guild } = newState
        const oldChannel = oldState.channel
        const newChannel = newState.channel
        const joinToCreate = "1030821612427149363"
        
        if(oldChannel !== newChannel && newChannel && newChannel.id === joinToCreate) {
            const voiceChannel = await guild.channels.create(member.user.id, {
                type : "GUILD_VOICE" ,
                parent : newChannel.parent ,
                permissionOverwrites : [
                    { id : member.id , allow : ["CONNECT"] } ,
                    { id : guild.id , deny : ["CONNECT"] }
                ]
            })
            
            voiceGenerator.set(member.id , voiceChannel.id)
            newChannel.permissionOverwrites.edit(member , {CONNECT : false})
            setTimeout(() => newChannel.permissionOverwrites.delete(member) , 3000)
            
            return setTimeout(() => member.voice.setChannel(voiceChannel) , 1000)
        }
        
        const ownedChannel = voiceGenerator.get(member.id)
        
        if(ownedChannel && oldChannel.id == ownedChannel && (!newChannel || newChannel.id !== ownedChannel)) {
            voiceGenerator.set(member.id , null);
            oldChannel.delete().catch(() => {});
        }
    }
}
