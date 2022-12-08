const { Schema , model } = require("mongoose")

const animeSchema = new Schema({
    _id : String,
    anime : [
        {
            title : String,
            englishTitle : String,
            type : String,
            image : String,
            source : String,
            episodes : Number,
            status : String,
            statistics : {
                score : 0,
                scored_by : 0,
                rank : 0,
                popularity : 0,
                member : 0,
                favorites : 0,
            },
            airing : Boolean,
            aired : {
                from : String,
                to : String
            },
            characters : [
                {
                    id : String,
                    name : String,
                    image : String,
                    role : String,
                    url : String
                }
            ]
        }
    ]
})

module.exports = model("anime", animeSchema)
