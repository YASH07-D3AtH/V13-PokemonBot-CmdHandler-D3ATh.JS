const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "crate",
    description: "Check out all your recevied crates!",
    options: [
        {
            name: "open",
            description: "Provide the name of the crate which u want to open!",
            type: 3,
            required: false,
            choices: [
                {
                    name: "Bronze",
                    value: "bronze"
                },
                {
                    name: "Silver",
                    value: "silver"
                },
                {
                    name: "Golden",
                    value: "golden"
                },
                {
                    name: "Diamond",
                    value: "diamond"
                },
                {
                    name: "Deluxe",
                    value: "deluxe"
                }
            ]
        },
        {
            name: "amount",
            description: "Provide amount of boxes u want to open!",
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`{prefix}start\` before using this command.` })

        let embed = new Discord.MessageEmbed()
            .setAuthor("Crates - Voting Rewards")
            .addField("<:box_bronze:875935678893031434> **Bronze Crate**", `${user.bronzecrate} crates`)
            .addField("<:box_silver:875935581870391296> **Silver Crate**", `${user.silvercrate} crates`)
            .addField("<:box_golden:875935554355744798> **Golden Crate**", `${user.goldencrate} crates`)
            .addField("<:box_diamond:875935620684468264> **Diamond Crate**", `${user.diamondcrate} crates`)
            .addField("<:box_deluxe:875935641219772427> **Deluxe Crate**", `${user.deluxecrate} crates`)
            .setFooter(`You can open your crates with "/crate open <bronze | silver | golden | diamond | deluxe> [amount]".`)
            .setColor(color)
            .setThumbnail(client.user.displayAvatarURL())

        if (!args[0]) return interaction.followUp({ embeds: [embed] })
        else if (args[0]) {
            let name = args[0].split(" ")[0]
            let amount
            if (args[1]) {
                amount = parseInt(args[1].split(" ")[0])
                if (isNaN(amount)) return interaction.followUp({ content : "Failed to convert `Parametre` to `Int`."})
            } else {
                amount = 1
            }

            if (args[1] && args[1].split(" ").length >= 2) return interaction.followUp({ content: "You can't open more than 15 crates at once!" })



            if (name == "bronze") {
                return interaction.followUp({ content: `bronze - ${amount}` })
            } else if (name == "silver") {
                return interaction.followUp({ content: "silver" })
            } else if (name == "golden") {
                return interaction.followUp({ content: "golden" })
            } else if (name == "diamond") {
                return interaction.followUp({ content: "diamond" })
            } else if (name == "deluxe") {
                return interaction.followUp({ content: "deluxe" })
            } else {
                return interaction.followUp({ content: "`/crate open <name> [amount]`" })
            }


        }



    }
}