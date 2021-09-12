const client = require("../index");
const PACKAGE = require("../package.json");
const Discord = require('discord.js')
const mongoose = require("mongoose");



client.on("ready", () =>
    console.log(`Logged in as ${client.user.tag}!\n=--------------------------=`)
)

mongo_atlas = {
    username: "Ashish-OP",
    password: "A_S_H_I_S_H_F_R_E_E_F_I_R_E",
    cluster: "Pokecool",
    shard: {
        one: "pokecool-shard-00-00.t6ofj.mongodb.net:27017",
        two: "pokecool-shard-00-01.t6ofj.mongodb.net:27017",
        three: "pokecool-shard-00-02.t6ofj.mongodb.net:27017"
    }
}

mongoose.connect(`mongodb://${mongo_atlas.username}:${mongo_atlas.password}@${mongo_atlas.shard.one},${mongo_atlas.shard.two},${mongo_atlas.shard.three}/${mongo_atlas.cluster}?ssl=true&replicaSet=${mongo_atlas.cluster}-shard-0&authSource=admin&retryWrites=true`, {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(async mon => {
        console.log(`=--------------------------=\nConnected to the Database!`);
    }).catch((err) => {
        console.log("Unable to connect to the Mongodb Database. Error:\n" + err.stack)
    });

