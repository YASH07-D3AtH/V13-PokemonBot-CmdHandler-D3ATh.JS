const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js")
const Discord = require('discord.js')
const { get } = require('request-promise-native');
const User = require('../../models/user.js')
const Market = require('../../models/market.js')
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const Forms = require('../../db/forms.js');
const Gmax = require('../../db/gmax.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const shiny = require('../../db/shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Concept = require('../../db/concept.js');
const Pokemon = require('../../db/pokemons.js');

module.exports = {
    name: "market",
    description: "Buy items from Shop!",
    options: [
        {
            type: 'SUB_COMMAND',
            name: "search",
            description: "Search market for a [specific] pokemon(s)!",
            options: [
                {
                    name: 'filters',
                    description: "Provide valid filters to search for!",
                    type: 3,
                    required: false
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "info",
            description: "Take a look at the Pokémon's stats listed on markets.",
            options: [
                {
                    name: 'id',
                    description: "Provide market id of the pokémon which you would like to see!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "buy",
            description: "Buy a Pokémon from the markets.",
            options: [
                {
                    name: 'id',
                    description: "Provide market id of the pokémon which you would like to buy!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: "list",
            description: "List your pokémon on the markets.",
            options: [
                {
                    name: 'id',
                    description: "Provide id of your pokémon which you would like to list!",
                    type: 4,
                    required: true
                },
                {
                    name: 'price',
                    description: "Provide price at which you would like to list you pokémon!",
                    type: 4,
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'listings',
            description: 'Check all your pokémons listed on the markets.'
        },
        {
            type: 'SUB_COMMAND',
            name: 'remove',
            description: 'Remove your listed pokémon from the markets.',
            options: [
                {
                    name: "id",
                    description: 'Provide market id of the pokémon which you would like to remove!',
                    type: 4,
                    required: true
                }
            ]
        }
    ],


    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        const [subcommand] = args

        if (subcommand == "remove") {

            let market = await Market.find()
            market = market.map((r, i) => {
                r.num = i + 1
                return r
            }).filter(r => r.id === user.id)

            let id = parseInt(args[1])
            if (isNaN(id)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })

            if (!market.find(r => r.num === id)) return interaction.followUp({ content: `You can't remove this pokémon because it isn't present in your Market Listings!` })

            num = id
            let data = market.find(r => r.num === id)
            console.log(id)

            if (data) {

                let embed = new MessageEmbed()
                    .setDescription(`${interaction.user.tag}\nAre you sure you want to remove your **Level ${data.pokemon.level} ${data.pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${data.pokemon.totalIV}\`% Iv ) from the markets ?`)
                    .setColor(color)

                let row = new MessageActionRow()
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
                let rowx = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("YES")
                            .setStyle("SUCCESS")
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
                        user.pokemons.push(data.pokemon)
                        await user.markModified(`pokemons`)

                        await user.save()
                        await Market.deleteOne({ id: data.id, pokemon: data.pokemon, price: data.price })
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
                return interaction.followUp({ content: `You can't remove this Pokémon because it isn't present in your Market Listings` })
            }

        } else if (subcommand == "list") {

            let id = parseInt(args[1])
            let price = args[3]
            if (isNaN(id) || isNaN(price)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })

            num = id - 1
            if (!user.pokemons[num]) return interaction.followUp({ content: `Unable to find Pokémon N\`${id}\` in your collection!` })
            if (price > 10000000) return interaction.followUp({ content: `You cannot List your pokémon on the markets for more than **\`10,000,000\`** Credits!` })

            let embed = new MessageEmbed()
                .setAuthor(`🛒 ・ ${client.user.username} Market`)
                .setDescription(`${interaction.user.tag}\nAre you sure you want to list your **Level ${user.pokemons[num].level} ${user.pokemons[num].name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**  ( \`${user.pokemons[num].totalIV}\`% Iv ) on the markets ?\n**Price**: ${price.toLocaleString()}`)
                .setColor(color)

            let row = new MessageActionRow()
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
            let rowx = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("YES")
                        .setStyle("SUCCESS")
                        .setCustomId('yes')
                        .setDisabled(),
                    new MessageButton()
                        .setLabel("NO")
                        .setStyle("DANGER")
                        .setCustomId("no")
                        .setDisabled()
                )


            interaction.followUp({ embeds: [embed], components: [row] })

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
                filter, max: 1
            })

            collector.on('collect', async i => {
                if (i.customId === 'yes') {
                    collector.stop("yes")
                    await i.deferUpdate()
                    interaction.editReply({ components: [rowx] })
                    let newDoc = new Market({
                        id: interaction.user.id,
                        pokemon: user.pokemons[num],
                        price: price
                    })

                    user.pokemons.splice(num, 1)

                    await user.save().catch(e => console.log(e))
                    await newDoc.save().catch(e => console.log(e))
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


        } else if (subcommand == "buy") {
            let market = await Market.find()
            let id = parseInt(args[1]), num = id - 1
            if (isNaN(id)) return interaction.followUp({ content: `Failed to convert \`Parametre\` to \`Int\`.` })
            if (!market[num]) return interaction.followUp({ content: `Unable to find that pokémon in the markets!` })

            let check = await Market.findOne({ id: user.id, pokemon: market[num].pokemon, price: market[num].price })

            if (check) return interaction.followUp({ content: `You can't buy your own Listed Pokémon!` })

            if (market[num].price > user.balance) return interaction.followUp({ content: `You don't have enough ${market[num].price == 1 ? "credit" : "credits"} to buy **Level ${market[num].pokemon.level} ${market[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}**!` })


            let vmsg = `Your **Level ${market[num].pokemon.level} ${market[num].pokemon.name} ( \`${market[num].pokemon.totalIV}\`% Iv )** has been bought by ${interaction.user.tag} and you have received ${market[num].price.toLocaleString()} ${market[num].price == 1 ? "credit" : "credits"}!`

            let embed = new MessageEmbed()
                .setTitle(`🛒 ・ ${client.user.username} Market`)
                .setDescription(`${interaction.user.tag}\nAre you sure you want to buy **Level ${market[num].pokemon.level} ${market[num].pokemon.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}** ( \`${market[num].pokemon.totalIV}\`% Iv ) from the markets ?\n**Price**: ${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`)
                .setColor(color)

            let row = new MessageActionRow()
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
            let rowx = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("YES")
                        .setStyle("SUCCESS")
                        .setCustomId('yes')
                        .setDisabled(),
                    new MessageButton()
                        .setLabel("NO")
                        .setStyle("DANGER")
                        .setCustomId("no")
                        .setDisabled()
                )


            interaction.followUp({ embeds: [embed], components: [row] })

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
                filter, max: 1
            })

            collector.on('collect', async i => {
                if (i.customId === 'yes') {
                    collector.stop("yes")
                    await i.deferUpdate()
                    interaction.editReply({ components: [rowx] })

                    user.pokemons.push(market[num].pokemon)
                    user.balance = user.balance - market[num].price
                    await user.markModified(`pokemons`)
                    await user.save().catch(console.error)
                    let userd = await User.findOne({ id: market[num].id })
                    await Market.deleteOne({ id: market[num].id, pokemon: market[num].pokemon, price: market[num].price })
                    interaction.channel.send({ content: "Success!" })
                    if (userd) {
                        userd.balance += market[num].price
                        await userd.save().catch(console.error)
                        let userD = client.users.cache.get(market[num].id)
                        await userD.send(vmsg).catch(e => {
                            if (e.message.toLowerCase() === "cannot send messages to this user") return
                        })
                    }
                    return
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
        } else if (subcommand == "info") {

            let market = await Market.find()
            let id = parseInt(args[1]), num = id - 1
            if (!market[id]) return interaction.followUp({ content: `Unable to find that pokémon in the markets!` })

            let a = market, s = a.map((r, num) => { r.pokemon.num = num + 1; return r })

            let level = market[num].pokemon.level,
                hp = market[num].pokemon.hp,
                atk = market[num].pokemon.atk,
                def = market[num].pokemon.def,
                spatk = market[num].pokemon.spatk,
                spdef = market[num].pokemon.spdef,
                speed = market[num].pokemon.speed,
                nb = market[num].pokemon._nb,
                types = `${market[num].pokemon.rarity
                    }`,
                nature = market[num].pokemon.nature,
                totalIV = market[num].pokemon.totalIV,
                pokename = market[num].pokemon.name.replace(" ", "-").toLowerCase().trim(),
                name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                    }`,
                xp = `${market[num].pokemon.xp
                    }/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140
                    }`,
                hpBase,
                atkBase,
                defBase,
                spatkBase,
                spdefBase,
                speedBase,
                hpTotal,
                atkTotal,
                defTotal,
                spatkTotal,
                spdefTotal,
                speedTotal,
                url = market[num].pokemon.url,
                price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`

            let gen8 = Gen8.find(e => e.name.toLowerCase() === pokename),
                form = Forms.find(e => e.name.toLowerCase() === pokename),
                concept = Concept.find(e => e.name.toLowerCase() === pokename),
                galarian = Galarians.find(e => e.name.toLowerCase() === pokename.replace("galarian-", "")),
                mega = Mega.find(e => e.name.toLowerCase() === pokename.replace("mega-", "").toLowerCase()),
                shadow = Shadow.find(e => e.name.toLowerCase() === pokename.replace("shadow-", "").toLowerCase()),
                primal = Primal.find(e => e.name === pokename.replace("primal-", "").toLowerCase()),
                pokemon = Pokemon.find(e => e.name.english.toLowerCase() === pokename),
                gmax = Gmax.find(e => e.name.toLowerCase() === pokename.replace("gigantamax-", "").toLowerCase())

            if (gen8) {
                hpBase = gen8.hp,
                    atkBase = gen8.atk,
                    defBase = gen8.def,
                    spatkBase = gen8.spatk,
                    spdefBase = gen8.spdef,
                    speedBase = gen8.speed
            } else if (form) {
                hpBase = form.hp,
                    atkBase = form.atk,
                    defBase = form.def,
                    spatkBase = form.spatk,
                    spdefBase = form.spdef,
                    speedBase = form.speed
            } else if (concept) {
                hpBase = concept.hp,
                    atkBase = concept.atk,
                    defBase = concept.def,
                    spatkBase = concept.spatk,
                    spdefBase = concept.spdef,
                    speedBase = concept.speed
            } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                hpBase = galarian.hp,
                    atkBase = galarian.atk,
                    defBase = galarian.def,
                    spatkBase = galarian.spatk,
                    spdefBase = galarian.spdef,
                    speedBase = galarian.speed
            } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                hpBase = mega.hp,
                    atkBase = mega.atk,
                    defBase = mega.def,
                    spatkBase = mega.spatk,
                    spdefBase = mega.spdef,
                    speedBase = mega.speed
            } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                hpBase = shadow.hp,
                    atkBase = shadow.atk,
                    defBase = shadow.def,
                    spatkBase = shadow.spatk,
                    spdefBase = shadow.spdef,
                    speedBase = shadow.speed
            } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                hpBase = primal.hp,
                    atkBase = primal.atk,
                    defBase = primal.def,
                    spatkBase = primal.spatk,
                    spdefBase = primal.spdef,
                    speedBase = primal.speed
            } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                hpBase = gmax.hp,
                    atkBase = gmax.atk,
                    defBase = gmax.def,
                    spatkBase = gmax.spatk,
                    spdefBase = gmax.spdef,
                    speedBase = gmax.speed
            } else if (pokemon) {
                hpBase = pokemon.base.hp,
                    atkBase = pokemon.base.attack,
                    defBase = pokemon.base.defense,
                    spatkBase = pokemon.base.spatk,
                    spdefBase = pokemon.base.spdef,
                    speedBase = pokemon.base.speed
            } else {

                if (pokename.startsWith("alolan")) {
                    pokename = pokename.replace("alolan-", "").toLowerCase().trim()
                    pokename = `${pokename}-alola`.toLowerCase().trim()
                }

                let t = await get({
                    url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                    json: true
                }).catch((err) => {
                    return interaction.followUp({ content: "An error occured to info the pokemon. Please contact the developers of the bot!" })
                })
                hpBase = t.stats[0].base_stat,
                    atkBase = t.stats[1].base_stat,
                    defBase = t.stats[2].base_stat,
                    spatkBase = t.stats[3].base_stat,
                    spdefBase = t.stats[4].base_stat,
                    speedBase = t.stats[5].base_stat
            }

            hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

            let Embed = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length
                }\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)


            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("⬅")
                        .setStyle("SUCCESS")
                        .setCustomId("back"),
                    new MessageButton()
                        .setLabel("➡")
                        .setStyle("SUCCESS")
                        .setCustomId("forward")
                )
            let rowx = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel("⬅")
                        .setStyle("SUCCESS")
                        .setCustomId('disabledyes')
                        .setDisabled(),
                    new MessageButton()
                        .setLabel("➡")
                        .setStyle("SUCCESS")
                        .setCustomId("disabledno")
                        .setDisabled()
                )

            let msg = interaction.followUp({ embeds: [Embed], components: [row] })

            const filter = async (interaction) => {
                if (user.id == interaction.user.id) return true
                if (user.id != interaction.user.id) {
                    await interaction.deferUpdate()
                    let m = await interaction.reply({ content: "Only **command author** can interact with buttons!" })
                    setTimeout(() => m.delete(), 4000)
                    return false
                }
            }

            const collector = interaction.channel.createMessageComponentCollector({
                filter, max: 10
            })

            collector.on('collect', async i => {
                await i.deferUpdate()
                if (i.customId === 'forward') {

                    num += 1
                    if (num >= s.length - 1) num = 0
                    level = market[num].pokemon.level,
                        hp = market[num].pokemon.hp,
                        atk = market[num].pokemon.atk,
                        def = market[num].pokemon.def,
                        spatk = market[num].pokemon.spatk,
                        spdef = market[num].pokemon.spdef,
                        speed = market[num].pokemon.speed,
                        nb = market[num].pokemon._nb,
                        types = `${market[num].pokemon.rarity
                        }`,
                        nature = market[num].pokemon.nature,
                        totalIV = market[num].pokemon.totalIV,
                        pokename = market[num].pokemon.name.replace(" ", "-").toLowerCase().trim(),
                        name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                        }`,
                        xp = `${market[num].pokemon.xp
                        }/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140
                        }`,
                        hpBase,
                        atkBase,
                        defBase,
                        spatkBase,
                        spdefBase,
                        speedBase,
                        hpTotal, 
                        atkTotal,
                        defTotal,
                        spatkTotal,
                        spdefTotal,
                        speedTotal,
                        url = market[num].pokemon.url,
                        price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`,

                        gen8 = Gen8.find(e => e.name.toLowerCase() === pokename),
                        form = Forms.find(e => e.name.toLowerCase() === pokename),
                        concept = Concept.find(e => e.name.toLowerCase() === pokename),
                        galarian = Galarians.find(e => e.name.toLowerCase() === pokename.replace("galarian-", "")),
                        mega = Mega.find(e => e.name.toLowerCase() === pokename.replace("mega-", "").toLowerCase()),
                        shadow = Shadow.find(e => e.name.toLowerCase() === pokename.replace("shadow-", "").toLowerCase()),
                        primal = Primal.find(e => e.name === pokename.replace("primal-", "").toLowerCase()),
                        pokemon = Pokemon.find(e => e.name.english.toLowerCase() === pokename),
                        gmax = Gmax.find(e => e.name.toLowerCase() === pokename.replace("gigantamax-", "").toLowerCase())

                    if (gen8) {
                        hpBase = gen8.hp,
                            atkBase = gen8.atk,
                            defBase = gen8.def,
                            spatkBase = gen8.spatk,
                            spdefBase = gen8.spdef,
                            speedBase = gen8.speed
                    } else if (form) {
                        hpBase = form.hp,
                            atkBase = form.atk,
                            defBase = form.def,
                            spatkBase = form.spatk,
                            spdefBase = form.spdef,
                            speedBase = form.speed
                    } else if (concept) {
                        hpBase = concept.hp,
                            atkBase = concept.atk,
                            defBase = concept.def,
                            spatkBase = concept.spatk,
                            spdefBase = concept.spdef,
                            speedBase = concept.speed
                    } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                        hpBase = galarian.hp,
                            atkBase = galarian.atk,
                            defBase = galarian.def,
                            spatkBase = galarian.spatk,
                            spdefBase = galarian.spdef,
                            speedBase = galarian.speed
                    } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                        hpBase = mega.hp,
                            atkBase = mega.atk,
                            defBase = mega.def,
                            spatkBase = mega.spatk,
                            spdefBase = mega.spdef,
                            speedBase = mega.speed
                    } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                        hpBase = shadow.hp,
                            atkBase = shadow.atk,
                            defBase = shadow.def,
                            spatkBase = shadow.spatk,
                            spdefBase = shadow.spdef,
                            speedBase = shadow.speed
                    } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                        hpBase = primal.hp,
                            atkBase = primal.atk,
                            defBase = primal.def,
                            spatkBase = primal.spatk,
                            spdefBase = primal.spdef,
                            speedBase = primal.speed
                    } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                        hpBase = gmax.hp,
                            atkBase = gmax.atk,
                            defBase = gmax.def,
                            spatkBase = gmax.spatk,
                            spdefBase = gmax.spdef,
                            speedBase = gmax.speed
                    } else if (pokemon) {
                        hpBase = pokemon.base.hp,
                            atkBase = pokemon.base.attack,
                            defBase = pokemon.base.defense,
                            spatkBase = pokemon.base.spatk,
                            spdefBase = pokemon.base.spdef,
                            speedBase = pokemon.base.speed
                    } else {

                        if (pokename.startsWith("alolan")) {
                            pokename = pokename.replace("alolan-", "").toLowerCase().trim()
                            pokename = `${pokename}-alola`.toLowerCase().trim()
                        }

                        console.log(pokename)
                        let t = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                            json: true
                        }).catch((err) => {
                            return interaction.channel.send({ content: "An error occured to info the pokemon. Please contact the developers of the bot!" })
                        })
                        hpBase = t.stats[0].base_stat,
                            atkBase = t.stats[1].base_stat,
                            defBase = t.stats[2].base_stat,
                            spatkBase = t.stats[3].base_stat,
                            spdefBase = t.stats[4].base_stat,
                            speedBase = t.stats[5].base_stat
                    }

                    hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                        atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                        defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                        spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                        spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                        speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                    let Embed1 = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length
                        }\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)

                    return interaction.editReply({ embeds: [Embed1] })
                }

                if (i.customId === 'back') {
                    num -= 1
                    if (num <= -1) num = s.length - 1
                    level = market[num].pokemon.level,
                        hp = market[num].pokemon.hp,
                        atk = market[num].pokemon.atk,
                        def = market[num].pokemon.def,
                        spatk = market[num].pokemon.spatk,
                        spdef = market[num].pokemon.spdef,
                        speed = market[num].pokemon.speed,
                        nb = market[num].pokemon._nb,
                        types = `${market[num].pokemon.rarity
                        }`,
                        nature = market[num].pokemon.nature,
                        totalIV = market[num].pokemon.totalIV,
                        pokename = market[num].pokemon.name.replace(" ", "-").toLowerCase().trim(),
                        name = `${market[num].pokemon.name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                        }`,
                        xp = `${market[num].pokemon.xp
                        }/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 + 51 * level - 140
                        }`,
                        hpBase,
                        atkBase,
                        defBase,
                        spatkBase,
                        spdefBase,
                        speedBase,
                        hpTotal,
                        atkTotal,
                        defTotal,
                        spatkTotal,
                        spdefTotal,
                        speedTotal,
                        url = market[num].pokemon.url,
                        price = `${market[num].price.toLocaleString()}  ${market[num].price == 1 ? "credit" : "credits"}`,

                        gen8 = Gen8.find(e => e.name.toLowerCase() === pokename),
                        form = Forms.find(e => e.name.toLowerCase() === pokename),
                        concept = Concept.find(e => e.name.toLowerCase() === pokename),
                        galarian = Galarians.find(e => e.name.toLowerCase() === pokename.replace("galarian-", "")),
                        mega = Mega.find(e => e.name.toLowerCase() === pokename.replace("mega-", "").toLowerCase()),
                        shadow = Shadow.find(e => e.name.toLowerCase() === pokename.replace("shadow-", "").toLowerCase()),
                        primal = Primal.find(e => e.name === pokename.replace("primal-", "").toLowerCase()),
                        pokemon = Pokemon.find(e => e.name.english.toLowerCase() === pokename),
                        gmax = Gmax.find(e => e.name.toLowerCase() === pokename.replace("gigantamax-", "").toLowerCase())

                    if (gen8) {
                        hpBase = gen8.hp,
                            atkBase = gen8.atk,
                            defBase = gen8.def,
                            spatkBase = gen8.spatk,
                            spdefBase = gen8.spdef,
                            speedBase = gen8.speed
                    } else if (form) {
                        hpBase = form.hp,
                            atkBase = form.atk,
                            defBase = form.def, 
                            spatkBase = form.spatk,
                            spdefBase = form.spdef,
                            speedBase = form.speed
                    } else if (concept) {
                        hpBase = concept.hp,
                            atkBase = concept.atk,
                            defBase = concept.def,
                            spatkBase = concept.spatk,
                            spdefBase = concept.spdef,
                            speedBase = concept.speed
                    } else if (galarian && market[num].pokemon.name.toLowerCase().startsWith("galarian")) {
                        hpBase = galarian.hp,
                            atkBase = galarian.atk,
                            defBase = galarian.def,
                            spatkBase = galarian.spatk,
                            spdefBase = galarian.spdef,
                            speedBase = galarian.speed
                    } else if (mega && market[num].pokemon.name.toLowerCase().startsWith("mega-")) {
                        hpBase = mega.hp,
                            atkBase = mega.atk,
                            defBase = mega.def,
                            spatkBase = mega.spatk,
                            spdefBase = mega.spdef,
                            speedBase = mega.speed
                    } else if (shadow && market[num].pokemon.name.toLowerCase().startsWith("shadow-")) {
                        hpBase = shadow.hp,
                            atkBase = shadow.atk,
                            defBase = shadow.def,
                            spatkBase = shadow.spatk,
                            spdefBase = shadow.spdef,
                            speedBase = shadow.speed
                    } else if (primal && market[num].pokemon.name.toLowerCase().startsWith("primal-")) {
                        hpBase = primal.hp,
                            atkBase = primal.atk,
                            defBase = primal.def,
                            spatkBase = primal.spatk,
                            spdefBase = primal.spdef,
                            speedBase = primal.speed
                    } else if (gmax && market[num].pokemon.name.toLowerCase().startsWith("gigantamax-")) {
                        hpBase = gmax.hp,
                            atkBase = gmax.atk,
                            defBase = gmax.def,
                            spatkBase = gmax.spatk,
                            spdefBase = gmax.spdef,
                            speedBase = gmax.speed
                    } else if (pokemon) {
                        hpBase = pokemon.base.hp,
                            atkBase = pokemon.base.attack,
                            defBase = pokemon.base.defense,
                            spatkBase = pokemon.base.spatk,
                            spdefBase = pokemon.base.spdef,
                            speedBase = pokemon.base.speed
                    } else {

                        if (pokename.startsWith("alolan")) {
                            pokename = pokename.replace("alolan-", "").toLowerCase().trim()
                            pokename = `${pokename}-alola`.toLowerCase().trim()
                        }

                        console.log(pokename)
                        let t = await get({
                            url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                            json: true
                        }).catch((err) => {
                            return interaction.channel.send({ content: "An error occured to info the pokemon. Please contact the developers of the bot!" })
                        })
                        hpBase = t.stats[0].base_stat,
                            atkBase = t.stats[1].base_stat,
                            defBase = t.stats[2].base_stat,
                            spatkBase = t.stats[3].base_stat,
                            spdefBase = t.stats[4].base_stat,
                            speedBase = t.stats[5].base_stat
                    }

                    hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                        atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                        defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                        spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                        spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                        speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)

                    let Embed2 = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types}\n**Nature**: ${nature}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).addField("__Market Details__", `**ID**: ${num + 1}\n**Price**: ${price}`).setFooter(`Displaying Market Pokémon: ${num + 1}/${s.length
                        }\nUse "${prefix}market buy ${num + 1}" to buy this Pokémon.`).setImage(url).setColor(color)

                    interaction.editReply({ embeds: [Embed2] })
                }
            })

            collector.on('end', async (i) => {
                return interaction.editReply({ components: [rowx] })
            })
        }
    }
}
