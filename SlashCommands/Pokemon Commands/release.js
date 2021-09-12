const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "release",
    description: "Release your pokémons into the wild!",
    options: [
        {
            name: "number",
            description: "Provide the pokémon number(s) which you want to release (<latest/l/0> / selected / <Id1 Id2 ...>) !",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id });
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })


        const [number] = args
        let x = number

        if (x.toLowerCase() == "latest" || x.toLowerCase() == "l" || x.toLowerCase() == "0") {

            let embed = new MessageEmbed(), msg = `Are you sure want to release the following Pokémon?`
            embed
                .addField(msg, `\`Level ${user.pokemons[user.pokemons.length - 1].level} |${user.pokemons[user.pokemons.length - 1].shiny == true ? " ⭐" : ""} ${user.pokemons[user.pokemons.length - 1].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} | ${user.pokemons[user.pokemons.length - 1].totalIV}% Iv\``)
                .setColor(color)
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

            interaction.followUp({ embeds: [embed], components: [row] })

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
                    user.pokemons.pop()
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
                return
            })

        } else if (x.toLowerCase() == "all" || x.toLowerCase() == "max") {

            let embed = new MessageEmbed(),
                msg = `Are you sure want to release all your \`${user.pokemons.length}\` ${user.pokemons.length <= 1 ? "pokémon" : "pokémons"} ?`
            embed
                .setDescription(msg)
                .setColor(color)

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

            interaction.followUp({ embeds: [embed], components: [row] })

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
                    user.pokemons = []
                    user.selected = null
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
                return
            })

        } else {
            x = parseInt(x)
            if (!Number(x)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`" })

            let pokes = [], name, num


            num = parseInt(args[0].split(" ")[0]) - 1;
            if (isNaN(num)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`" })
            if (num >= user.pokemons.length) return interaction.followUp({ content: "You don't have a pokémon with `" + (num + 1) + "` number" })
            name = user.pokemons[num].name


            for (let x = 0; x < args[0].split(" ").length; x++) {
                if (!isNaN(args[0].split(" ")[x])) {
                    num = parseInt(args[0].split(" ")[x]) - 1
                    if (num >= user.pokemons.length) return interaction.followUp({ content: "You don't have a pokémon with `" + (num + 1) + "` number" })
                    name = user.pokemons[num].name
                    pokes.push(user.pokemons[num])
                }
            }
            let p = "pokémon"
            if (pokes.length > 1) p = "pokémons"

            let embed = new MessageEmbed()
                .addField(`Are you sure you want to release the following ${p}?`, pokes.map(r => `\`Level ${r.level} ${r.shiny ? "⭐ " : ""}${r.name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())} (${r.totalIV}% IV)\``).join("\n"))
                .setColor("RANDOM")

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

            interaction.followUp({ embeds: [embed], components: [row] })

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
                    for (var z = 0; z < pokes.length; z++) {
                        pokes[z]
                        if (user.pokemons.find(r => r === pokes[z])) {
                            let index = user.pokemons.indexOf(pokes[z]);
                            if (index > -1) {
                                await user.pokemons.splice(index, 1);
                                user.released = user.released + 1;
                                await user.markModified("pokemons");
                                await user.save();
                            }
                        }
                    }
                    user.selected = null
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
                return
            })


        }


    }
};