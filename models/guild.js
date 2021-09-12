const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
    id: { type: String, required: true },
    prefix: { type: String, default: "p!" },
    spawnchannel: { type: String, default: null },
    blacklist: {type: Boolean, default: false}
});

module.exports = mongoose.model("Guild", GuildSchema);
