const { Permissions, MessageEmbed , Constants } = require("discord.js");
const ms = require('ms')

module.exports = {
    name : 'timeout',
    description : 'Gives a member a timeout.',
    slash : true,
    permissions : [Permissions.FLAGS.MODERATE_MEMBERS],
    type : Discord.Constants.ApplicationCommandTypes.CHAT_INPUT,
    options : [
        {
            name : 'member',
            description : 'Member ',
            type : Constants.ApplicationCommandOptionTypes.USER,
            required : true
        },
        {
            name : 'time',
            description : 'Duration',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : true
        },
        {
            name : 'reason',
            description : 'Reason',
            type : Constants.ApplicationCommandOptionTypes.STRING,
            required : false
        }

    ],
    async execute({interaction , options , message}){
        if(message)return;

        await interaction.deferReply({ephemeral : true})
        const m = options.getUser('member')
        const member = interaction.guild.members.cache.get(m.id)
        const mod = interaction.member
        var reason = options.getString('reason')
        if(!reason) reason = 'Unspecified.'
        const number = options.getString('time')

        //Embeds
        const timeoutSuccessEmbed = new MessageEmbed()
                                    .setColor('BLUE')
                                    .setTitle('TIME-OUT')
                                    .setDescription(`${member.user.username} was timed-out for ${number}`)
                                    .addFields(
                                        {name : "Moderator : " , value : 'Member : ', inline : true},
                                        { name: `${mod.user.username}`,value : `${member.user.username}`, inline: true }
                                    )
        
        if(mod.roles.highest.position > member.roles.highest.position || mod.id == interaction.guild.ownerId){
            member.timeout(ms(number) , reason)
                .then(() => interaction.editReply({embeds : [timeoutSuccessEmbed] , ephemeral : true}))
                .catch((err) => {interaction.editReply({content : 'Sorry , I am unable to perform this action.' , ephemeral :true})} )
        }
        else{
            interaction.editReply({content : "You don't have the authorisation to use this command." , ephemeral : true})
        }

    }
}
