const client = require("../index");
const Discord = require('discord.js')
let Guild = require('../models/guild.js');
let User = require("../models/user.js");
let msgamount = 0
const { get } = require('request-promise-native')
const { classToPlain } = require("class-transformer");
const Pokemon = require("./../Classes/Pokemon");
let Spawn = require("../models/spawn.js");

client.on("messageCreate", async (message) => {

    let guild = await Guild.findOne({ id: message.guild.id });
    if (!guild) await new Guild({ id: message.guild.id }).save();
    guild = await Guild.findOne({ id: message.guild.id })
    let user = await User.findOne({ id: message.author.id });
    let prefix = guild.prefix;
    let color = "#FF35B8"
    let channel = client.channels.cache.get(message.channel.id);

    let embed = new Discord.MessageEmbed()
        .addField(`Heyy , I am ${client.user.username}!`, "The current prefix for this server is `" + guild.prefix + "`")
        .setColor(color)

    msgamount = msgamount + 1
    if (msgamount == 30) {

        if (!channel.permissionsFor(client.user.id).has(["SEND_MESSAGES", 'READ_MESSAGE_HISTORY', 'EMBED_LINKS'])) return

        msgamount = 0
        if (guild.spawnbtn == false) return
        if (guild.disabledChannels.includes(message.channel.id)) return
        if (guild.spawnchannel !== null) channel = client.channels.cache.get(guild.spawnchannel)
        if (channel == undefined || channel == null) channel = message.channel
        
        let spawn = await Spawn.findOne({ id: channel.id });
        if (!spawn) await new Spawn({ id: channel.id }).save();
        spawn = await Spawn.findOne({ id: channel.id })

        function random() {
            let array = require('fs')
                .readFileSync('./db/dex.txt')
                .toString()
                .toLowerCase()
                .replace(" ", "-").replace("’", "-")
                .trim()
                .split('\n')
                .map(r => r.trim())
            return array[Math.floor(Math.random() * array.length)]
        }

        let name = random()

        const options = {
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            json: true
        }
        if (name.toLowerCase().startsWith("zacian")) options.url = "https://pokeapi.co/api/v2/pokemon/zacian-hero";
        if (name.toLowerCase().startsWith("giratina")) options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
        if (name.toLowerCase().startsWith("deoxys")) options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
        if (name.toLowerCase().startsWith("shaymin")) options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
        if (name.toLowerCase() === "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
        if (name.toLowerCase() === "nidoran-f") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
        if (name.toLowerCase().startsWith("porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
        if (name.toLowerCase().startsWith("landorus")) options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
        if (name.toLowerCase().startsWith("thundurus")) options.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
        if (name.toLowerCase().startsWith("tornadus")) options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
        if (name.toLowerCase().includes("mr.mime")) options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
        if (name.toLowerCase().startsWith("pumpkaboo")) options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
        if (name.toLowerCase().startsWith("meowstic")) options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
        if (name.toLowerCase().startsWith("toxtricity")) options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
        if (name.toLowerCase().startsWith("mimikyu")) options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised";

        await get(options).then(async t => {
            let check = t.id.toString().length
            let url;
            if (check === 1) {
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
            } else if (check === 2) {
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
            } else if (check === 3) {
                url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
            }

            var re;
            const Type = t.types.map(r => {
                if (r !== r) re = r;
                if (re == r) return;
                return `${r.type.name}`
            }).join(" | ")
            let lvl = Math.floor(Math.random() * 50)
            let shiny = false

            let poke = new Pokemon({ name: name, id: t.id, rarity: Type, url: url, shiny: shiny }, lvl);
            poke = await classToPlain(poke);

            let embed = new Discord.MessageEmbed()
                .setAuthor("A Wild Pokémon has appeared!")
                .setDescription(`Guess the pokémon and type \`${prefix}catch <pokemon>\` to catch it!`)
                .setImage(poke.url)
                .setColor(color)
            await channel.send({ embeds: [embed] })
            spawn.pokemon = []
            spawn.pokemon.push(poke)
            await spawn.markModified("pokemons")
            await spawn.save()

        }).catch(err => {
            if (err.message.includes(`404 - "Not Found"`)) return channel.send(`Unable to spawn this pokemon\nName: ${name}`);
            if (err.message.toLowerCase().startsWith(`VersionError`)) return;
        });
    }

    if (!message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) return;
    if (!message.channel.permissionsFor(client.user.id).has("VIEW_CHANNEL")) return;
    if (!message.channel.permissionsFor(client.user.id).has("EMBED_LINKS")) return;
    if (!message.channel.permissionsFor(client.user.id).has("ATTACH_FILES")) return;

    if (message.author.bot || !message.guild) return;
    if (message.content.toLowerCase() == `<@!${client.user.id}>` || message.content.toLowerCase() == `<@${client.user.id}>`) return message.channel.send({ embeds: [embed] })
    if (message.content.toLowerCase().startsWith(prefix)) return

    if (message.content.toLowerCase().startsWith(guild.prefix.toLowerCase()) && guild.blacklist == true) return message.channel.send({ content: "This server has been blacklisted. Join support server to appeal." });
    if (user && user.blacklist == true && message.content.toLowerCase().startsWith(guild.prefix)) return message.channel.send({ content: "You have been **Blacklisted**. Join support server to appeal!\nhttps://discord.gg/rjuEhWpk" })

    const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase()))
    if (!command) return;
    await command.run(client, message, args, prefix, guild, color, channel).catch(err => {
        if ([`versionerror`, `no matching document`, `missing permissions`].includes(err.message.toLowerCase())) return;
        if (err.message.includes(`404 - "Not Found"`)) return message.channel.send({ content: "This Pokémon doesn't seem to appear in the Pokedex or maybe you spelled it wrong!" });
        return console.log(err.stack)
    })
})

