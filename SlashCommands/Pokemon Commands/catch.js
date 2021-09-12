const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js')
const Spawn = require("../../models/spawn.js")
const altnames = require("../../db/altnames.js")
const shinydb = require("../../db/shiny.js")

module.exports = {
    name: "catch",
    description: "Check out all your recevied crates!",
    options: [
        {
            name: "name",
            description: "Provide the pokémon name which you want to catch!",
            type: 3,
            required: true,
        }
    ],
    run: async (client, interaction, args, color, prefix) => {


        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })
        let name = args[0].split(" ").join("-").toLowerCase()
        // console.log("1: " + name)

        let spawn = await Spawn.findOne({ id: interaction.channel.id })
        if (!spawn.pokemon[0]) return interaction.followUp({ content: "There is no active spawned pokémon here!" });

        let alt = altnames.find(x => {
            return (x.name.toLowerCase() == name.trim() || x.frname.toLowerCase() == name.trim() || x.dename.toLowerCase() == name.trim() || x.jpname.split(" | ").find(r => r.toLowerCase() == name.trim())
            )
        })
        if (alt == undefined) return interaction.followUp({ content: `\`${name}\` is the wrong guess!` })
        name = name.replace(name, alt.name).toLowerCase().replace(" ", "-")
        // console.log(name)
        let poke = spawn.pokemon[0];
        if (!poke) return

        if ((poke) && (poke.name.toLowerCase().replace(" ", "-") == name)) {
            // spawn.pokemon = [];
            await spawn.markModified("pokemons");
            await spawn.updateOne({
                pokemon : []
            });

            let chance = Math.floor(Math.random() * 100)

            let lvl = poke.level + 1
            poke.xp = ((lvl - 1) + 80 * lvl + 100 + 51);

            if ((user.shname !== null) && (name == user.shname.toLowerCase().replace(" ", "-")) && (chance >= 96)) {
                poke.shiny = true
                user.shname = null
                user.shcont = 0
                ++user.shinyCaught
            } else if (poke.shiny) {
                if ((user.shname !== null) && (name == user.shname.toLowerCase().replace(" ", "-"))) {
                    user.shname = null
                    user.shcont = 0
                    ++user.shinyCaught
                } else {
                    ++user.shinyCaught
                }
            }
            user.lbcaught = user.lbcaught + 1
            await user.pokemons.push(poke)
            await user.caught.push(poke)
            await user.markModified("pokemons");
            await user.markModified("caught");
            await user.save();
  
            let u = " ", footer = " ", t = " "
            if (user.shname !== null) {
                if (name == user.shname.toLowerCase().replace(" ", "-")) {
                    u = `Congratulations ${interaction.user.username}! You caught a Level \`${poke.level}\`${poke.shiny == true ? " **Shiny**" : ""} **${name.replace(/-+/g, " ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${poke.totalIV}\`% IV )!\n**+1 Shiny Count**`
                    footer = `Shinyhunt Chain Count: ${user.shcount + 1}`
                    user.shcount = user.shcount + 1
                    await user.save()
                } else {
                    u = `Congratulations ${interaction.user.username}! You caught a Level \`${poke.level}\`${poke.shiny == true ? " **Shiny**" : ""} **${name.replace(/-+/g, " ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${poke.totalIV}\`% IV )!`
                    footer = " " 
                }
            } else if (user.shname == null) {
                u = `Congratulations ${interaction.user.username}! You caught a Level \`${poke.level}\`${poke.shiny == true ? " **Shiny**" : ""} **${name.replace(/-+/g, " ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${poke.totalIV}\`% IV )!`
                footer = " "
            } else {
                u = `Congratulations ${interaction.user.username}! You caught a Level \`${poke.level}\`${poke.shiny == true ? " **Shiny**" : ""} **${name.replace(/-+/g, " ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${poke.totalIV}\`% IV )!`
                footer = " "

            }
            if (poke.shiny != true) {
                t = poke.url
            } else if (poke.shiny == true) {
                let url = shinydb.find(x => x.name == name)
                if (url == undefined) t = poke.url
                else t = url.url
            } else {
                t = poke.url
            }

            let embed = new MessageEmbed()
                .setFooter(footer)
                .setColor(color)
                .setDescription(u)
                .setThumbnail(t)

            return interaction.followUp({ embeds: [embed] })

        } else {
            return interaction.followUp({ content: `\`${name}\` is the wrong guess!` })
        }
    }
}
