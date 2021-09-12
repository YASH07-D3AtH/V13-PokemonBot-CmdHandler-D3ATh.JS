const { Client, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const { MessageEmbed, MessageCollector, Collection } = require("discord.js")
const { get } = require('request-promise-native')
const User = require("../../models/user.js")
const Spawn = require("../../models/spawn.js")
const altnames = require("../../db/altnames.js")
const Pokemon = require("../../Classes/Pokemon.js")
const { classToPlain } = require("class-transformer")
const galar = require('../../db/galarians.js')
let gen8 = require('../../db/gen8.js')

module.exports = {
    name: "redeem",
    description: "Redeem Get a pokémon for yourself , or Spawn it for someone else!",
    options: [
        {
            type: 'SUB_COMMAND',
            name: "spawn",
            description: "Use your redeem to Spawn a pokémon of your choice!",
            options: [
                {
                    name: 'name',
                    description: "Provide a pokémon name!",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "get",
            description: "Use your redeem to Get a pokémon of your choice!",
            options: [
                {
                    name: 'name',
                    description: "Provide a pokémon name!",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "credits",
            description: "Use your redeem to obtain 25,000 credits!"
        }
    ],


    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id });
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })
        let userx = await User.findOne({ id: interaction.user.id });
        if (!userx) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        const [subcommand] = args
        if (subcommand == "spawn") {
            let name = args[1].replace(" ", "-").toLowerCase().trim()
            let url, Type

            if (name.startsWith("shiny")) return interaction.followUp("You **cannot** directly redeem spawn shiny pokémons!")

            let alt = altnames.find(x => {
                return (x.name.toLowerCase() == name.trim() || x.frname.toLowerCase() == name.trim() || x.dename.toLowerCase() == name.trim() || x.jpname.split(" | ").find(r => r.toLowerCase() == name.trim())
                )
            }) 
            if (alt == undefined) {
                alt = {
                    name: name
                }
            }
            name = name.replace(name, alt.name).toLowerCase().replace(" ", "-").trim()

            let gg = galar.find(r => r.name === name.toLowerCase().replace("galarian-", ""))
            let findGen8 = gen8.find(r => r.name === name)
            let lvl = Math.floor(Math.random() * 50)

            if (gg && name.startsWith("galarian-")) {
                url = gg.url
                Type = gg.type

                let poke = new Pokemon({ name: name, url: url, rarity: Type }, lvl);
                poke = await classToPlain(poke);
                let spawn = await Spawn.findOne({ id: interaction.channel.id });
                if (!spawn) await new Spawn({ id: interaction.channel.id }).save();
                spawn = await Spawn.findOne({ id: interaction.channel.id })
                spawn.pokemon = []
                spawn.pokemon.push(poke)
                await spawn.save()
                user.redeems = user.redeems - 1

                let embed = new MessageEmbed()
                    .setAuthor("A Wild Pokémon has appeared!")
                    .setDescription(`Guess the pokémon and type \`${prefix}catch <pokémon>\` to catch it!`)
                    .setImage(poke.url)
                    .setColor(color)
                await user.save()
                return interaction.followUp({ embeds: [embed] })

            } else if (findGen8) {

                url = findGen8.url
                Type = findGen8.type

                let poke = new Pokemon({ name: name, url: url, rarity: Type }, lvl);
                poke = await classToPlain(poke);
                let spawn = await Spawn.findOne({ id: interaction.channel.id });
                if (!spawn) await new Spawn({ id: interaction.channel.id }).save();
                spawn = await Spawn.findOne({ id: interaction.channel.id })
                spawn.pokemon = []
                spawn.pokemon.push(poke)
                await spawn.save()
                user.redeems = user.redeems - 1

                let embed = new MessageEmbed()
                    .setAuthor("A Wild Pokémon has appeared!")
                    .setDescription(`Guess the pokémon and type \`${prefix}catch <pokémon>\` to catch it!`)
                    .setImage(poke.url)
                    .setColor(color)
                await user.save()
                return interaction.followUp({ embeds: [embed] })


            } else if (!gg && !findGen8) {

                const options = {
                    url: `https://pokeapi.co/api/v2/pokemon/${name}`,
                    json: true
                }
                if (name.toLowerCase().startsWith("giratina")) options.url = "https://pokeapi.co/api/v2/pokemon/giratina-altered"
                if (name.toLowerCase().startsWith("deoxys")) options.url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal"
                if (name.toLowerCase().startsWith("shaymin")) options.url = "https://pokeapi.co/api/v2/pokemon/shaymin-land"
                if (name.toLowerCase() == "nidoran") options.url = "https://pokeapi.co/api/v2/pokemon/nidoran-m"
                if (name.toLowerCase == "porygon") options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z"
                if (name.toLowerCase().startsWith("porygon-z")) options.url = "https://pokeapi.co/api/v2/pokemon/porygon-z"
                if (name.toLowerCase().startsWith("landorus")) options.url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate"
                if (name.toLowerCase().startsWith("thundurus")) options.url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate"
                if (name.toLowerCase().startsWith("tornadus")) options.url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate"
                if (name.toLowerCase().startsWith("mr.mime")) options.url = "https://pokeapi.co/api/v2/pokemon/mr-rime"
                if (name.toLowerCase().startsWith("pumpkaboo")) options.url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average"
                if (name.toLowerCase().startsWith("meowstic")) options.url = "https://pokeapi.co/api/v2/pokemon/meowstic-male"
                if (name.toLowerCase().startsWith("toxtricity")) options.url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped"
                if (name.toLowerCase() == "mimikyu") options.url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised"

                await get(options).then(async t => {
                    let check = t.id.toString().length

                    if (check === 1) {
                        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                    } else if (check === 2) {
                        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                    } else if (check === 3) {
                        url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                    } else {
                        return interaction.followUp({ content: `\`${name}\` doesn't seem to exist or maybe you spelled it wrong!` })
                    }

                    var re
                    const Type = t.types.map(r => {
                        if (r !== r) re = r
                        if (re == r) return
                        return `${r.type.name}`
                    }).join(" | ")
                    let poke = new Pokemon({ name: name, id: t.id, url: url, rarity: Type }, lvl);
                    poke = await classToPlain(poke);
                    let spawn = await Spawn.findOne({ id: interaction.channel.id });
                    if (!spawn) await new Spawn({ id: interaction.channel.id }).save();
                    spawn = await Spawn.findOne({ id: interaction.channel.id })
                    spawn.pokemon = []
                    spawn.pokemon.push(poke)
                    await spawn.save()
                    user.redeems = user.redeems - 1

                    let embed = new MessageEmbed()
                        .setAuthor("A Wild Pokémon has appeared!")
                        .setDescription(`Guess the pokémon and type \`${prefix}catch <pokémon>\` to catch it!`)
                        .setImage(url)
                        .setColor(color)
                    return interaction.followUp({ embeds: [embed] })

                }).catch(err => {
                    if (err.message.includes(`404 - "Not Found"`)) return interaction.followUp({ content: `\`${name}\` doesn't seem to exist or maybe you spelled it wrong!` })
                    return
                })
            } else {
                return interaction.followUp({ content: `\`${name}\` doesn't seem to exist or maybe you spelled it wrong!` })
            }
        } else if (subcommand == "get") {
            const name = args[1].replace(" ", "-").toLowerCase().trim()
            return interaction.followUp({ content: name })
        } else if (subcommand == "credits") {
            return interaction.followUp({ content: "credits" })
        } else {
            return
        }
    }
};
