const { Schema , model } = require("mongoose")

module.exports = model("memberLog", new Schema({
    Guild : String,
    memberLog : String,
    botRole : String,
}))
