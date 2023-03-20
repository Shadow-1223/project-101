const { Schema , model } = require("mongoose")

module.exports = model("EmbedDB", new Schema({
    _id: String,
    channelID : String,
    link : String,
    title : String,
    description : String,
    image : String,
    hexColor : String,
}))
