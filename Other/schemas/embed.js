const { Schema , model } = require("mongoose")

module.exports = model("EmbedBuilder", new Schema({
    description : String,
    title : String,
    image : String,
    hexColor : String,
    
}))
