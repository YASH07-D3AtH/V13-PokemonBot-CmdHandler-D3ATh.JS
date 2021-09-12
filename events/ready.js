const client = require("../index");
const PACKAGE = require("../package.json");
const Discord = require('discord.js')
const mongoose = require("mongoose");



client.on("ready", () =>
    console.log(`Logged in as ${client.user.tag}!\n=--------------------------=`)
)

mongo_atlas = {
    username: "",
    password: "",
    cluster: "",
    shard: {
        one: "",
        two: "",
        three: ""
    }
}

if (mongo_atlas) {
    
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
}
