const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');
const Gmax = require('../../db/gmax.js');
const Form = require('../../db/forms.js');

module.exports = {
    name: "buy",
    description: "Buy items from Shop!",
    options: [
        {
            name: "number",
            description: "Provide the shop number which you want to buy from!",
            type: 3,
            required: true,
            choices: [
                {
                    name: "1",
                    value: "1"
                },
                {
                    name: "2",
                    value: "2"
                },
                {
                    name: "3",
                    value: "3"
                },
                {
                    name: "4",
                    value: "4"
                },
                {
                    name: "5",
                    value: "5"
                },
                {
                    name: "6",
                    value: "6"
                },
                {
                    name: "7",
                    value: "7"
                },
            ]
        },
        {
            name: "item",
            description: "Provide the item name which you want to buy!",
            type: 3,
            required: true,
        },
        {
            name: "amount",
            description: "Optional - Provide the number of items you want to buy!",
            type: 4,
            required: false
        }
    ],
    run: async (client, interaction, args, color) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        console.log(args)

        let shopnumber = args[0].trim()
        let item = args[1].split(" ").join("-").toLowerCase().trim()

        if (shopnumber == "1") {
            if (user.selected == null || user.selected == undefined) return interaction.followUp({ content: `You must select a pokémon before transforming it!` })

            if (item == "candy") {

                let poke = user.pokemons[user.selected]
                if (poke == null || poke == undefined) return interaction.followUp({ content: `You must select a pokémon before transforming it!` })
                let level = poke.level
                let amount = parseInt(args[2])
                if (!amount) amount = 1

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("YES")
                            .setStyle("SUCCESS")
                            .setCustomId("yes"),
                        new MessageButton()
                            .setLabel("NO")
                            .setStyle("DANGER")
                            .setCustomId("no")
                    )
                const rowx = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("YES")
                            .setStyle("SUCCESS")
                            .setCustomId("yes")
                            .setDisabled(),
                        new MessageButton()
                            .setLabel("NO")
                            .setStyle("DANGER")
                            .setCustomId("no")
                            .setDisabled()
                    )

                let msg = `Are you sure want to buy ${amount} ${amount == 1 ? "**candy**" : "**candies**"} for \`${amount * 75}\` cr?`
                await interaction.followUp({ content: msg, components: [row] })

                const filter = async (interaction) => {
                    if (user.id == interaction.user.id) return true
                    if (user.id != interaction.user.id) {
                        await interaction.deferUpdate()
                        let m = await interaction.channel.send({ content: "Only **command author** can interact with buttons!" })
                        setTimeout(() => m.delete(), 4000)
                        return false
                    }
                }

                const collector = interaction.channel.createMessageComponentCollector({
                    filter, max: 1, time: 6000
                })

                collector.on('collect', async i => {
                    if (i.customId === 'yes') {
                        collector.stop("yes")
                        await i.deferUpdate()
                        interaction.editReply({ components: [rowx] })
                        poke.level += amount
                        user.balance -= amount * 75
                        await user.save()
                        return interaction.channel.send({ content: "Success!" })
                    }

                    if (i.customId === 'no') {
                        collector.stop("no")
                        interaction.editReply({ components: [rowx] })
                        await i.deferUpdate()
                        return interaction.channel.send({ content: "Ok Aborted!" })
                    }
                })

                collector.on('end', () => {
                    return interaction.editReply({ components: [rowx] })
                })



            } else return interaction.followUp({ content: `Item: \`${item}\` doesn't exist on shop \`${shopnumber}\`! ` })

        } else if (shopnumber == "2") {

        } else if (shopnumber == "3") {

        } else if (shopnumber == "4") {

            if (item == "everstone") return interaction.channel.send("everstone")
            if (item == "xp-blocker") return interaction.channel.send("xp blocker")
            return interaction.followUp({ content: `Item: \`${item}\` doesn't exist on shop \`${shopnumber}\`! ` })
        } else if (shopnumber == "5") {

            if (user.selected == null || user.selected == undefined) return interaction.followUp({ content: "You must select a pokémon before transforming it!" })

            let poke = user.pokemons[user.selected]
            let pokename = poke.name.toLowerCase().replace(/\s+/g, '-')
            let form = Form.find(r => r.name == item)
            if (form == undefined) return interaction.followUp({ content: `Your Pokémon doesn't have a ${item.replace("-", " ")} transformation!` })

            if (!item.endsWith(pokename)) return interaction.followUp({ content: `Your Pokémon doesn't transform into \`${item.replace("-", " ")}\`!` })
            if (form) {
                poke.url = form.url
                poke.name = item
                poke.rarity = form.type
                user.balance = user.balance - 1000
                await user.markModified("pokemons")
                await user.save()
                return interaction.followUp({ content: `Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!` })
            } else {
                return interaction.followUp({ content: `Your Pokémon doesn't have a ${item.replace("-", " ")} transformation!` })
            }



        } else if (shopnumber == "6") {

            if (item == "gigantamax" || item == "gmax") {

                if (user.selected == null || user.selected == undefined) return interaction.followUp({ content: "You must select a pokémon before transforming it!" })

                let poke = user.pokemons[user.selected]
                let pokename = poke.name.toLowerCase().replace(/\s+/g, '-')

                let gmax = Gmax.find(r => r.name == pokename)
                if (gmax == undefined) return interaction.followUp({ content: `Your Pokémon doesn't have a \`${args.slice(1).join(" ").replace("-", " ")}\` transformation!` })

                if (gmax) {
                    poke.name = `gigantamax-${pokename}`
                    poke.url = gmax.url
                    poke.rarity = gmax.type
                    user.balance = user.balance - 25000
                    await user.markModified("pokemons")
                    await user.save()
                    return interaction.followUp({ content: `Your Pokémon just transformed into \`${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!` })
                } else {
                    return interaction.followUp({ content: `Your Pokémon doesn't have a \`${args.slice(1).join(" ").replace("-", " ")}\` transformation!` })
                }

            } else {
                return interaction.followUp({ content: `Item: \`${item.replace("-", " ")}\` doesn't exist on shop \`${shopnumber}\`! ` })
            }

        } else if (shopnumber == "7") {

            if (item == "pokemon" || item == "p" || item == "pokemons") {

            } else if (item == "incense") {

            } else if (item == "redeems" || item == "redeem") {

                let amount = args[2]
                if (amount == 0) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
                if (!amount || amount == undefined) amount = parseInt(1)
                if (amount >= 16) return interaction.followUp({ content: `You cannot buy more than \`15\` **redeems** at once!` })
                if (user.shards <= (amount * 200) + 1) return interaction.followUp({ content: `You don't have enought **shards** to buy ${amount} ${amount <= 1 ? "redeem" : "redeems"}!` })

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("YES")
                            .setStyle("SUCCESS")
                            .setCustomId("yes"),
                        new MessageButton()
                            .setLabel("NO")
                            .setStyle("DANGER")
                            .setCustomId("no")
                    )
                const rowx = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("YES")
                            .setStyle("SUCCESS")
                            .setCustomId("yes")
                            .setDisabled(),
                        new MessageButton()
                            .setLabel("NO")
                            .setStyle("DANGER")
                            .setCustomId("no")
                            .setDisabled()
                    )

                let msg = `Are you sure want to buy ${amount} ${amount == 1 ? "**redeem**" : "**redeems**"} for ${amount * 200} shards?`
                await interaction.followUp({ content: msg, components: [row] })

                const filter = (interaction) => {
                    if (user.id == interaction.user.id) return true
                    return
                }

                const collector = interaction.channel.createMessageComponentCollector({
                    filter, max: 1
                })

                collector.on('collect', async i => {
                    if (i.customId === 'yes') {
                        collector.stop("yes")
                        await i.deferUpdate()
                        interaction.editReply({ components: [rowx] })
                        // user.redeems += amount
                        // user.shards -= amount * 200
                        // await user.save()
                        await user.updateOne({
                            $inc: { redeems: amount },
                            $inc: { shards: -(amount * 200) }
                        })
                        return interaction.channel.send({ content: "Success!" })
                    }

                    if (i.customId === 'no') {
                        collector.stop("no")
                        interaction.editReply({ components: [rowx] })
                        await i.deferUpdate()
                        return interaction.channel.send({ content: "Ok Aborted!" })
                    }
                })

                collector.on('end', () => {
                    return
                })

            } else {
                return interaction.followUp({ content: `Item: \`${item.replace("-", " ")}\` doesn't exist on shop \`${shopnumber}\`! ` })
            }

        } else {
            return
        }



    }
}