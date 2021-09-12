const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "shinyhunt",
    cooldown: 55,
    description: "You can select a specific pokémon to shiny hunt. Shinyhunting = Shiny catching!",
    options: [
        {
            name: "name",
            description: "Provide the pokémon name which you want to hunt!",
            type: 3,
            required: false
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id });
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`{prefix}start\` before using this command.` })

        let embed = new MessageEmbed()
            .setAuthor("⭐ Shiny Hunt ")
            .setColor(color)
            .setDescription('You can select a specific pokémon to shiny hunt. Each time you catch that pokémon, your chain will increase. The longer your chain, the higher your chance of catching a shiny one!')
            .addField("Currently Hunting", `${user.shname == null ? "Type " + "`" + prefix + "shinyhunt <pokémon>" + "`" + " to begin." : `${user.shname.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`}`, true)
        user.shname == null ? "" : embed.addField("Streak", `${user.shcount}`, true)


        const [name] = args
        if (!name) return interaction.followUp({ embeds: [embed] })
        let x = name

        if (x && x.toLowerCase() == "reset") {
            if (user.shname == null) return interaction.followUp({ content: "You currently have no active shinyhunt!" })
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

            interaction.followUp({ content: `Are you sure want to reset your last Shinyhunt streak of **${user.shname.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${user.shcount}\` ) ?`, components: [row] })

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
                    i.deferUpdate()
                    user.shname = null
                    user.shcount = 0
                    await user.save()
                    return interaction.followUp({ content: "Success!" })
                }

                if (i.customId === 'no') {
                    i.deferUpdate()
                    collector.stop("no")
                    return interaction.followUp({ content: "Ok Aborted!" })
                }
            })

            collector.on('end', () => {
                return
            })

        } else if (x) {
            if (user.shname == null) {
                user.shname = x.toLowerCase().replace(" ", "-")
                user.shcount = 0
                await user.save()
                return interaction.followUp({ content: `You are now shinyhunting \`${x.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\`!` })

            } else {

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

                interaction.followUp({ content: `Are you sure want to reset your last Shinyhunt streak of **${user.shname.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${user.shcount}\` ) for **${x.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}** ?`, components: [row] })

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
                        i.deferUpdate()
                        user.shname = x.toLowerCase().replace(" ", "-")
                        user.shcount = 0
                        await user.save()
                        return interaction.followUp({ content: "Success!" })
                    }

                    if (i.customId === 'no') {
                        i.deferUpdate()
                        collector.stop("no")
                        return interaction.followUp({ content: "Ok Aborted!" })
                    }
                })

                collector.on('end', () => {
                    return
                })
            }
        } else {
            return
        }
    }
};