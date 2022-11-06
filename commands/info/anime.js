const { MessageEmbed , Permissions , Constants } = require("discord.js")
const anime = require("../utils/anime")

module.exports = {
    name : "anime_finder" ,
    description : "Find anime by name or ID" ,
    permissions : [Permissions.FLAGS.SEND_MESSAGES] ,
    slash : true ,
    options : [
        {
            name : "anime" ,
            description : "Please Enter anime name or ID" ,
            required : true ,
            type : Constants.ApplicationCommandOptionTypes.STRING
        }
    ] ,
    
    async execute({ interaction , client , options }) {
        let animeEmbed = new MessageEmbed()
        .setTitle("Finding Anime...")
        .setDescription("Please Wait...")
        .setColor("#0099ff")
        
        let message = await interaction.reply({
            embeds : [animeEmbed] ,
            fetchReply : true
        })
        
        let anime = options.getString("anime")
        let animeId = parseInt(anime);
        let animeFinder = await new anime(client)
        if(!isNaN(animeId)) {
            try {
                console.log(animeId);
                let foundAnime = await animeFinder.getAnimeById(animeId);
                if(!foundAnime) {
                    animeEmbed.title = "Anime Not Found."
                    animeEmbed.description = "Please Try Again."
                    animeEmbed.color = "#ff0000"
                    return message.edit({
                        embeds : [animeEmbed] 
                    })
                }
                animeEmbed.title = foundAnime.title
                animeEmbed.description = foundAnime.description
                animeEmbed.color = "#0099ff"
                animeEmbed.setThumbnail(foundAnime.image)
                animeEmbed.addField("Type" , foundAnime.type , true)
                animeEmbed.addField("Episode" , foundAnime.episodes.toString() , true)
                animeEmbed.addField("Status" , foundAnime.statistics.status , true)
                animeEmbed.addField("Score" , foundAnime.statistics.score.toString() , true)
                animeEmbed.addField("Scored by" , foundAnime.statistics.scored_by.toString() , true)
                animeEmbed.addField("Rank" , foundAnime.statistics.rank.toString() , true)
                animeEmbed.addField("Popularity" , foundAnime.statistics.popurlarity.toString() , true)
                animeEmbed.addField("Members" , foundAnime.statistics.member.toString() , true)
                animeEmbed.addField("Favorites" , foundAnime.statistics.favorites.toString() , true)
                message.edit({
                    embeds : [animeEmbed] ,
                    fetchReply : true
                })
            } catch(err) { console.log(err) }
        } else {
            try {
                let foundAnime = await animeFinder.getAnimeByName(anime)
                if(!foundAnime) {
                    animeEmbed.title = "Anime Not Found"
                    animeEmbed.description = "Please Try Again"
                    animeEmbed.color = "#ff0000"
                    return message.edit({ embeds : [animeEmbed] })
                }
                
                if(Array.isArray(foundAnime)) {
                    foundAnime = foundAnime[0]
                }
                console.log(foundAnime)
                animeEmbed.title = foundAnime.title
                animeEmbed.description = foundAnime.description
                animeEmbed.color = "#0099ff"
                animeEmbed.addField("Type" , foundAnime.type , true)
                animeEmbed.addField("Episode" , foundAnime.episodes.toString() , true)
                animeEmbed.addField("Status" , foundAnime.statistics.status , true)
                animeEmbed.addField("Score" , foundAnime.statistics?.score.toString() || foundAnime.score.toString() , true)
                animeEmbed.addField("Scored by" , foundAnime.statistics?.scored_by.toString() || foundAnime.scored_by.toString() , true)
                animeEmbed.addField("Rank" , foundAnime.statistics?.rank.toString() || foundAnime.rank.toString() , true)
                animeEmbed.addField("Popularity" , foundAnime.statistics?.popurlarity.toString() || foundAnime.popularity.toString() , true)
                animeEmbed.addField("Members" , foundAnime.statistics?.member.toString() || foundAnime.member.toString() , true)
                animeEmbed.addField("Favorites" , foundAnime.statistics?.favorites.toString() || foundAnime.favorites.toString() , true)
                message.edit({
                    embeds : [animeEmbed] ,
                    fetchReply : true
                })
            } catch(err) { console.log(err) }
        }
    }
}
