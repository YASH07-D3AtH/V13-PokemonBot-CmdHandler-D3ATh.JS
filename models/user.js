const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true },
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 100 },
    level: { type: Number, default: 1 },
    selected: { type: Number, default: 0 },
    pokemons: { type: Array, default: [] },
    redeems: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    shards: { type: Number, default: 0 },
    badges: { type: Array, default: [] },
    released: { type: Number, default: 0 },
    orderAlphabet: { type: Boolean, default: false },
    orderIV: { type: Boolean, default: false },
    orderLevel: { type: Boolean, default: false },
    lbhide: { type: Boolean, default: false },
    shinyCaught: { type: Number, default: 0 },
    caught: { type: Array, default: [] },
    blacklist: { type: Boolean, default: false },
    createdAt: { type: String, default: Date.now() },
    lbcaught: { type: Number, default: 0 },
    shcount: { type: Number, default: 0 },
    shname: { type: String, default: null },
    bronzecrate: { type: Number, default: 0 },
    silvercrate: { type: Number, default: 0 },
    goldencrate: { type: Number, default: 0 },
    diamondcrate: { type: Number, default: 0 },
    deluxecrate: { type: Number, default: 0 },
    trade : { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);