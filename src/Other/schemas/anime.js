const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const animeSchema = new Schema({
    _id : String,
    title : String,
    englishTitle : String,
    description : String,
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
})

module.exports = mongoose.model("anime", animeSchema)
