const { Client, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "select",
    description: "Select your favorite pokémon!",
    options: [
        {
            name: "number",
            description: "Provide the pokémon number which you want to select (<latest/l/0> / <Id>) !",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction, args) => {

        let userx = await User.findOne({ id: interaction.user.id });
        if (!userx) return interaction.followUp({ content: `You must pick your starter pokémon with \`{prefix}start\` before using this command.` })


        const [number] = args

        let x = number

        if (x.toLowerCase() == "latest" || x.toLowerCase() == "l" || x.toLowerCase() == "0") {
            x = userx.pokemons.length
        } else {
            x = parseInt(x)
            // console.log(args)
            // console.log(args[0].split(" ").length)
            if (args[0].split(" ").length >= 2) return  interaction.followUp({ content: "You can only select a single pokémon at a time!" })
            if (!Number(x)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`" })
        }


        x = parseInt(x)
        x = x - 1

        if ((x <= -1) || (x >= userx.pokemons.length)) return interaction.followUp({ content: "You don't have pokémon on that number!" })


        userx.selected = x 
        await userx.save()
        return interaction.followUp({ content : `You selected your Level ${userx.pokemons[x].level}${userx.pokemons[x].shiny == true ? " :star:" : ""} **${userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}**!`})
    }
};