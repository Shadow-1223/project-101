// Main File for all anime related things
const jikan = require('@mateoaranda/jikanjs');
const animeSchema = require("../../schemas/anime.js")

class anime {
    constructor(client) {
        this.client = client;
        this.jikan = jikan;
        this.animeSchema = animeSchema;
    }
    async getAnimeById(id) {  
        // Check the schema for the anime
        try {
            let animeSchema = await this.animeSchema.findById(id);
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
               await this.animeSchema.findByIdAndUpdate(anime.mal_id,{ $set: aimeObject }, { upsert: true, new: true });
               return aimeObject;
            } catch(err) { return console.log('Anime Not Found', err); }
    }
    async getAnimeByName(name) {
        // Check the schema for the anime
        let animeSchema = await this.animeSchema.findOne({title: name});
        if (animeSchema == null) {
            // If the anime is not find get the full anime from jikan
            try {
                let anime = await this.jikan.search('anime', name);
                let numOfAnime = anime.data?.length;
                for (let i = 0; i < numOfAnime; i++) {
                    let animeObject = anime.data[i];
                    const animeDataObject = {
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
                    await this.animeSchema.findByIdAndUpdate(animeDataObject._id ,{ $set: animeDataObject }, { upsert: true, new: true });
                }
                // This is a half baked way of getting the anime structure
                // I need to find a better way of doing this
                // TODO: Find a better way of getting the anime structure
                let animeObject1 = anime.data[0];
                return {
                    _id: animeObject1.mal_id,
                    title: animeObject1.title,
                    englishTitle: animeObject1.title_english,
                    description: animeObject1.synopsis,
                    type: animeObject1.type,
                    image: animeObject1.images.jpg.image_url,
                    source: animeObject1.source,
                    episodes: animeObject1.episodes,
                    status: animeObject1.status,
                    statistics: {
                        score: animeObject1.score,
                        scored_by: animeObject1.scored_by,
                        rank: animeObject1.rank,
                        popularity: animeObject1.popularity,
                        member: animeObject1.members,
                        favorites: animeObject1.favorites,
                    },
                    airing: animeObject1.airing,
                    aired: {
                        from: animeObject1.aired.from,
                        to: animeObject1.aired.to,
                    },
                }
            } catch (err) { return console.log('Anime Not Found', err); }
        }
        return animeSchema;
    }
}
module.exports = anime;
