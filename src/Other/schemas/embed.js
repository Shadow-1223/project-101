const { Schema , model } = require("mongoose")

module.exports = model("EmbedBuilder", new Schema({
    channelID : String,
    link : String,
    title : String,
    description : String,
    image : String,
    hexColor : String,
}))
