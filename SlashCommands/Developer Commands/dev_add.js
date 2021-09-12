const { Client, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const { MessageEmbed, MessageCollector, Collection } = require("discord.js")
const { get } = require('request-promise-native')
const User = require('../../models/user.js');
const config = require('../../config.json')

module.exports = {
    name: "dev_add",
    description: "Add P/Cr/R/Sh to an User! #DevCmd!",
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
            name: "amountname",
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

        if (args == []) return interaction.followUp({ content: "`/dev_add [user] [item] [amount]`" })
        if (!args[0]) return interaction.followUp({ content: "**Missing User**:\n`/dev_add [user] [item] [amount]`" })
        if (!args[1]) return interaction.followUp({ content: "**Missing Item**:\n`/dev_add [user] [item] [amount]`" })
        if (!args[2]) return interaction.followUp({ content: "**Missing Amount**:\n`/dev_add [user] [item] [amount]`" })

        let userId, user, userx, amount = 0

        if (args[0].split(' ').length >= 2) {
            return interaction.followUp({ content: "**Replace whitespaces!**\n`/dev_add [user] [item] [amount]`" })
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
        if (!userx) return interaction.followUp({ content: `${user.tag} must pick his starter pokémon with \`${prefix}start\`!` })


        if (args[2].split(" ").length >= 2) {
            return interaction.followUp({ content: "`/dev_add [user] [item] [amount]`" })
        } else {
            amount = parseInt(args[2])
            if (isNaN(amount)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
            if (!amount) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`." })
        }

        if (args[1] == "p") {
            return interaction.followUp({ content: "Under Built!" })

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
                    userx.redeems += amount
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
                    userx.balance += amount
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
                    userx.shards += amount
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
            return interaction.followUp({ content: "That item doesn't exist!\n`/dev_add [user] [item] [amount]`" })
        }
    }
};
