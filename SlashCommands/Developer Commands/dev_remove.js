const { Client, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const { MessageEmbed, MessageCollector, Collection } = require("discord.js")
const { get } = require('request-promise-native')
const User = require('../../models/user.js');
const config = require('../../config.json')

module.exports = {
    name: "dev_remove",
    description: "Remove P/Cr/R/Sh from an User! #DevCmd!",
    options: [
        {
            name: "user",
            description: "Provide the user whom you want to add P/Cr/R/Sh's to!",
            type: 3,
            required: false
        },
        {
            name: "item",
            description: "Choose items from the above options!",
            type: 3,
            required: false,
            choices: [
                {
                    name: "pokemon",
                    value: "p"
                },
                {
                    name: "redeems",
                    value: "r",
                },
                {
                    name: "credits",
                    value: "cr"
                },
                {
                    name: "shards",
                    value: "sh"
                }
            ]
        },
        {
            name: "amountid",
            description: "Provide amount/name. (Mandatory)",
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction, args, color, prefix) => {
        if (!config.owners.includes(interaction.user.id)) return interaction.followUp(`Only **${client.user.username}** Owner/Developers can use this Command!`)

        /*
        args[0] = user id
        args[1] = item 
        args[2] = amount
        */

        if (args == []) return interaction.followUp({ content: "`/dev_remove [user] [item] [amount/id]`" })
        if (!args[0]) return interaction.followUp({ content: "**Missing User**:\n`/dev_remove [user] [item] [amount/id]`" })
        if (!args[1]) return interaction.followUp({ content: "**Missing Item**:\n`/dev_remove [user] [item] [amount/id]`" })
        if (!args[2]) return interaction.followUp({ content: "**Missing Amount**:\n`/dev_remove [user] [item] [amount/id]`" })

        let userId, user, userx, amount = 0

        if (args[0].split(' ').length >= 2) {
            return interaction.followUp({ content: "**Replace whitespaces!**\n`/dev_remove [user] [item] [amount/id]`" })
        } else {
            if (args[0].includes("<")) {
                userId = args[0].substring(3, args[0].length - 1)
            } else {
                userId = args[0]
            }
        }

        user = client.users.cache.get(`${userId}`)
        if (user == undefined) user = await client.users.fetch(`${userId}`)

        userx = await User.findOne({ id: user.id })
        if (!userx) return interaction.followUp({ content: `${user.tag} must pick your starter pokémon with \`${prefix}start\`.` })


        if (args[2].split(" ").length >= 2) {
            return interaction.followUp({ content: "`/dev_remove [user] [item] [amount/id]`" })
        } else {
            amount = parseInt(args[2])
            if (isNaN(amount)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
            if (!amount) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
        }

        if (args[1] == "p") {
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
            let poke = userx.pokemons[amount - 1]
            let msg = `Are you sure want to remove the following pokémon from ${user.tag} - ${user.id} ?`
            let embed = new MessageEmbed().setTitle(`Level ${poke.level} ${poke.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`).addField("__Details__", `**XP**: ${poke.xp}\n**Types**: ${poke.rarity.toString().replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\n**Nature**: ${poke.nature}`).addField("__Stats__", `**HP**: IV: ${poke.hp}/31\n**Attack**: IV: ${poke.atk}/31\n**Defense**: IV: ${poke.def}/31\n**Sp. Atk**: IV: ${poke.spatk}/31\n**Sp. Def**: IV: ${poke.spdef}/31\n**Speed**: IV: ${poke.speed}/31\n**Total IV%**: ${poke.totalIV}%`).setFooter(`Displaying Pokémon: ${amount}/${userx.pokemons.length
            }\nOwner: ${user.tag}`).setImage(poke.url).setColor(color).setThumbnail(user.displayAvatarURL())

            await interaction.followUp({ content: msg, embeds : [embed] , components: [row] })

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
                    await userx.pokemons.splice(amount -1 , 1) 
                    await userx.markModified("pokemons")
                    await userx.save()
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

        } else if (args[1] == "r") {

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

            let msg = `Are you sure want to give ${amount} ${amount == 1 ? "**redeem**" : "**redeems**"} to ${user.tag} - ${user.id} ?`
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
                    userx.redeems -= amount
                    await userx.save()
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

        } else if (args[1] == "cr") {

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

            let msg = `Are you sure want to give ${amount} ${amount == 1 ? "**credit**" : "**credits**"} to ${user.tag} - ${user.id} ?`

            interaction.followUp({ content: msg, components: [row] })

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
                    userx.balance -= amount
                    await userx.save()
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

        } else if (args[1] == "sh") {
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
            let msg = `Are you sure want to give ${amount} ${amount == 1 ? "**shard**" : "**shards**"} to ${user.tag} - ${user.id} ?`

            interaction.followUp({ content: msg, components: [row] })
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
                    userx.shards -= amount
                    await userx.save()
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
            return interaction.followUp({ content: "That item doesn't exist!\n`/dev_remove [user] [item] [amount/id]`" })
        }
    }
};
