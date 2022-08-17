// Main File for all anime related things
const jikan = require('@mateoaranda/jikanjs');
class anime {
    constructor(client) {
        this.client = client;
        this.jikan = jikan;
    }
    async getAnimeById(id) {  
        // Check the schema for the anime
        try {
            let animeSchema = await this.client.animeSchema.findById(id);
            if (animeSchema) return animeSchema
                let anime = await this.jikan.loadAnime(id);
                anime = anime.data
                console.log(anime)
                const aimeObject = {
                    _id: anime.mal_id,
                    title: anime.title,
                    englishTitle: anime.title_english,
                    description: anime.synopsis,
                    type: anime.type,
                    image: anime.images.jpg.image_url,
                    source: anime.source,
                    episodes: anime.episodes,
                    status: anime.status,
                    statistics: {
                        score: anime.score,
                        scored_by: anime.scored_by,
                        rank: anime.rank,
                        popularity: anime.popularity,
                        member: anime.members,
                        favorites: anime.favorites,
                    },
                    airing: anime.airing,
                    aired: {
                        from: anime.aired.from,
                        to: anime.aired.to,
                    },
                }
               await this.client.animeSchema.findByIdAndUpdate(anime.mal_id,{ $set: aimeObject }, { upsert: true, new: true });
               return aimeObject;
            } catch(err) { return console.log('Anime Not Found', err); }
    }
    async getAnimeByName(name) {
        // Check the schema for the anime
        let animeDataObject = await this.client.animeSchema.findOne({title: name});
        if (animeDataObject == null) {
            // If the anime is not find get the full anime from jikan
            try {
                let anime = await this.jikan.search('anime', name);
                let numOfAnime = anime.data?.length;
                for (let i = 0; i < numOfAnime; i++) {
                    let animeObject = anime.data[i];
                    animeDataObject = {
                        _id: animeObject.mal_id,
                        title: animeObject.title,
                        englishTitle: animeObject.title_english,
                        description: animeObject.synopsis,
                        type: animeObject.type,
                        image: animeObject.images.jpg.image_url,
                        source: animeObject.source,
                        episodes: animeObject.episodes,
                        status: animeObject.status,
                        statistics: {
                            score: animeObject.score,
                            scored_by: animeObject.scored_by,
                            rank: animeObject.rank,
                            popularity: animeObject.popularity,
                            member: animeObject.members,
                            favorites: animeObject.favorites,
                        },
                        airing: animeObject.airing,
                        aired: {
                            from: animeObject.aired.from,
                            to: animeObject.aired.to,
                        },
                        
                    }
                    await this.client.animeSchema.findByIdAndUpdate(animeDataObject._id ,{ $set: animeDataObject }, { upsert: true, new: true });
                }
                return animeDataObject;
            } catch (err) { return console.log('Anime Not Found', err); }
        }
        return animeDataObject;
    }
}
module.exports = anime;