const { MessageEmbed, Permissions, Constants } = require('discord.js');
const anime = require('../../utils/anime');

module.exports = {
    name: 'anime_finder',
    description: 'Find Anime by name or id',
    permissions: [Permissions.FLAGS.SEND_MESSAGES], 
    type: Constants.ApplicationCommandTypes.CHAT_INPUT,
    slash: true,
    options: [
        {
            name: 'anime',
            description: 'Please Enter the Anime Name or ID',
            required: true,
            type: Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    async execute({interaction, client, options}) {
        let embed = new MessageEmbed()
        .setTitle('Finding Anime...')
        .setDescription('Please Wait...')
        .setColor('#0099ff')

        let message = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        })
        
        const animeName = options.getString("anime")
        let animeId = parseInt(animeName);
        let animeFinder = await new anime(client)
        if(!isNaN(animeId)) {
            try {
            console.log(animeId);
            let foundAnime = await animeFinder.getAnimeById(animeId);
            if(!foundAnime) {
                embed.title = 'Anime Not Found';
                embed.description = 'Please Try Again';
                embed.color = '#ff0000';
                return message.edit({embeds: [embed]});
            }
            embed.title = foundAnime.title;
            embed.description = foundAnime.description;
            embed.color = '#0099ff';
            embed.setThumbnail(foundAnime.image);
            embed.addField('Type', foundAnime.type, true);
            embed.addField('Episodes', foundAnime.episodes.toString(), true);
            embed.addField('Status', foundAnime.status, true);
            embed.addField('Score', foundAnime.statistics.score.toString(), true);
            embed.addField('Scored By', foundAnime.statistics.scored_by.toString(), true);
            embed.addField('Rank', foundAnime.statistics.rank.toString(), true);
            embed.addField('Popularity', foundAnime.statistics.popularity.toString(), true);
            embed.addField('Members', foundAnime.statistics.member.toString(), true);
            embed.addField('Favorites', foundAnime.statistics.favorites.toString(), true);
            message.edit({ embeds: [embed], fetchReply: true })
        } catch(err) { console.log(err) } 
        } else {
            try {
                let foundAnime = await animeFinder.getAnimeByName(animeName);
                if(!foundAnime) {
                    embed.title = 'Anime Not Found';
                    embed.description = 'Please Try Again';
                    embed.color = '#ff0000';
                    return message.edit({embeds: [embed]});
                }
                // Check to see if it is a array
                if(Array.isArray(foundAnime)) {
                    foundAnime = foundAnime[0];
                }
                console.log(foundAnime);
                embed.title = foundAnime.title;
                embed.description = foundAnime.description;
                embed.color = '#0099ff';
                embed.setThumbnail(foundAnime.image);
                embed.addField('Type', foundAnime.type, true);
                embed.addField('Episodes', foundAnime.episodes.toString(), true);
                embed.addField('Status', foundAnime.status, true);
                embed.addField('Score', foundAnime.statistics?.score.toString() || foundAnime.score.toString(), true);
                embed.addField('Scored By', foundAnime.statistics?.scored_by.toString() ||  foundAnime.scored_by.toString(), true);
                embed.addField('Rank', foundAnime.statistics?.rank.toString() ||  foundAnime.rank.toString() , true);
                embed.addField('Popularity', foundAnime.statistics?.popularity.toString() ||  foundAnime.popularity.toString() , true);
                embed.addField('Members', foundAnime.statistics?.member.toString() ||  foundAnime.member.toString() , true);
                embed.addField('Favorites', foundAnime.statistics?.favorites.toString() ||  foundAnime.favorites.toString() , true);
                message.edit({ embeds: [embed], fetchReply: true })
            } catch(err) { console.log(err) }
        }
    }
}
