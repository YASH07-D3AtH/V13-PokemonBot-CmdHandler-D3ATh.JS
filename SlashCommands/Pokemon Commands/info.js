const { Client, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');
const { get } = require('request-promise-native');
// const Guild = require('../../models/guild.js');
const Shiny = require('../../db/shiny.js');
const Gen8 = require('../../db/gen8.js');
const shinydb = require('../../db/shiny.js');
const megashinydb = require('../../db/mega-shiny.js');
const Forms = require('../../db/forms.js');
const Concept = require('../../db/concept.js');
const Galarians = require('../../db/galarians.js');
const Mega = require('../../db/mega.js');
const ShinyMega = require('../../db/mega-shiny.js');
const Shadow = require('../../db/shadow.js');
const Primal = require('../../db/primal.js');
const Pokemon = require('../../db/pokemon.js');
const Gmax = require('../../db/gmax.js')

module.exports = {
    name: "info",
    description: "Displays your pokémon's info!",
    options: [
        {
            name: "number",
            description: "Provide the pokémon number which you want to Info.",
            type: 3,
            required: true
        }
    ],
    run: async (client, interaction, args) => {

        let userx = await User.findOne({ id: interaction.user.id });
        if (!userx) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })


        const [number] = args

        let x = number

        if (x.toLowerCase() == "latest" || x.toLowerCase() == "l" || x.toLowerCase() == "0") {
            x = userx.pokemons.length
        } else if (x.toLowerCase() == "selected" || x.toLowerCase() == "s") {
            if (userx.selected == null) return interaction.followUp({ content: "You don't have any active pokémon selected!" })
            if (userx.selected == undefined) return interaction.followUp({ content: "You don't have any active pokémon selected!" })
            x = userx.selected + 1
        } else {
            x = parseInt(x)
            if (!Number(x)) return interaction.followUp({ content: "Failed to convert `Parametre` to `Int`" })
        }


        x = parseInt(x)
        x = x - 1

        if ((x <= -1) || (x >= userx.pokemons.length)) return interaction.followUp({ content: "You don't have pokémon on that number!" })

        let level = userx.pokemons[x].level,
            hp = userx.pokemons[x].hp,
            atk = userx.pokemons[x].atk,
            def = userx.pokemons[x].def,
            spatk = userx.pokemons[x].spatk,
            spdef = userx.pokemons[x].spdef,
            speed = userx.pokemons[x].speed,
            url = userx.pokemons[x].url,
            helditem
        if (userx.pokemons[x].helditem !== undefined) helditem = userx.pokemons[x].helditem.join(" | ").replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
        if (helditem == []) helditem = "/-/"
        if (userx.pokemons[x].shiny == true) {
            if (userx.pokemons[x].name.toLowerCase().startsWith("mega-")) url = megashinydb.find(e => e.name === userx.pokemons[x].name.replace("mega-", "").toLowerCase()).url
            else url = shinydb.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()).url
        }
        let types = `${userx.pokemons[x].rarity
            }`,
            nature = userx.pokemons[x].nature.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            totalIV = userx.pokemons[x].totalIV,
            pokename = userx.pokemons[x].name.toLowerCase().replace(" ", "-")

        if (pokename.startsWith("alolan-")) {
            pokename = pokename.replace("alolan-", "");
            pokename = `${pokename}-alola`
        }
        if (pokename.startsWith("mega-")) {
            pokename = pokename.replace("mega-", "");
            pokename = `${pokename}`
        }

        let name
        if (userx.pokemons[x].shiny == true) {
            name = `⭐ ${userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                }`
        } else {
            name = `${userx.pokemons[x].name.replace(/-+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                }`
        }
        let xp = `${userx.pokemons[x].xp
            }/${((1.2 * level) ^ 3) - ((15 * level) ^ 2) + 100 * level - 140
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
            gen8 = Gen8.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()),
            form = Forms.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()),
            concept = Concept.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase()),
            galarian = Galarians.find(e => e.name.toLowerCase() === userx.pokemons[x].name.toLowerCase().replace("galarian-", "")),
            mega = Mega.find(e => e.name.toLowerCase() === userx.pokemons[x].name.replace("mega-", "").toLowerCase()),
            shadow = Shadow.find(e => e.name.toLowerCase() === userx.pokemons[x].name.replace("shadow-", "").toLowerCase()),
            primal = Primal.find(e => e.name === userx.pokemons[x].name.replace("primal-", "").toLowerCase()),
            pokemon = Pokemon.find(e => e.name === userx.pokemons[x].name.toLowerCase()),
            gmax = Gmax.find(e => e.name.toLowerCase() === userx.pokemons[x].name.replace("gigantamax-", "").toLowerCase())

        if (gen8) {
            if (userx.pokemons[x].rarity == null) userx.pokemons[x].rarity = gen8.type
            await userx.save()
            await userx.markModified("pokemons")
            // type = userx.pokemons[x].rarity
            hpBase = gen8.hp,
                atkBase = gen8.atk,
                defBase = gen8.def,
                spatkBase = gen8.spatk,
                spdefBase = gen8.spdef,
                speedBase = gen8.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (form) {
            hpBase = form.hp,
                atkBase = form.atk,
                defBase = form.def,
                spatkBase = form.spatk,
                spdefBase = form.spdef,
                speedBase = form.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (concept) {
            hpBase = concept.hp,
                atkBase = concept.atk,
                defBase = concept.def,
                spatkBase = concept.spatk,
                spdefBase = concept.spdef,
                speedBase = concept.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (galarian && userx.pokemons[x].name.toLowerCase().startsWith("galarian")) {
            hpBase = galarian.hp,
                atkBase = galarian.atk,
                defBase = galarian.def,
                spatkBase = galarian.spatk,
                spdefBase = galarian.spdef,
                speedBase = galarian.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (mega && userx.pokemons[x].name.toLowerCase().startsWith("mega-")) {
            hpBase = mega.hp,
                atkBase = mega.atk,
                defBase = mega.def,
                spatkBase = mega.spatk,
                spdefBase = mega.spdef,
                speedBase = mega.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (shadow && userx.pokemons[x].name.toLowerCase().startsWith("shadow-")) {
            hpBase = shadow.hp,
                atkBase = shadow.atk,
                defBase = shadow.def,
                spatkBase = shadow.spatk,
                spdefBase = shadow.spdef,
                speedBase = shadow.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (primal && userx.pokemons[x].name.toLowerCase().startsWith("primal-")) {
            hpBase = primal.hp,
                atkBase = primal.atk,
                defBase = primal.def,
                spatkBase = primal.spatk,
                spdefBase = primal.spdef,
                speedBase = primal.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (gmax && userx.pokemons[x].name.toLowerCase().startsWith("gigantamax-")) {
            hpBase = gmax.hp,
                atkBase = gmax.atk,
                defBase = gmax.def,
                spatkBase = gmax.spatk,
                spdefBase = gmax.spdef,
                speedBase = gmax.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else if (pokemon) {
            hpBase = pokemon.hp,
                atkBase = pokemon.atk,
                defBase = pokemon.def,
                spatkBase = pokemon.spatk,
                spdefBase = pokemon.spdef,
                speedBase = pokemon.speed,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        } else {

            let t = await get({
                url: `https://pokeapi.co/api/v2/pokemon/${pokename}`,
                json: true
            }).catch((err) => {
                return interaction.followUp({ content: "> An error occured in info*ing* the pokemon. Please contact the developers of the bot!" })
            })
            hpBase = t.stats[0].base_stat,
                atkBase = t.stats[1].base_stat,
                defBase = t.stats[2].base_stat,
                spatkBase = t.stats[3].base_stat,
                spdefBase = t.stats[4].base_stat,
                speedBase = t.stats[5].base_stat,
                hpTotal = Math.floor(Math.floor((2 * hpBase + hp + (0 / 4)) * level / 100 + 5) * 1),
                atkTotal = Math.floor(Math.floor((2 * atkBase + atk + 0) * level / 100 + 5) * 0.9),
                defTotal = Math.floor(Math.floor((2 * defBase + def + (0 / 4)) * level / 100 + 5) * 1),
                spatkTotal = Math.floor(Math.floor((2 * spatkBase + spatk + (0 / 4)) * level / 100 + 5) * 1.1),
                spdefTotal = Math.floor(Math.floor((2 * spdefBase + spdef + (0 / 4)) * level / 100 + 5) * 1),
                speedTotal = Math.floor(Math.floor((2 * speedBase + speed + (0 / 4)) * level / 100 + 5) * 1)
        }

        let Embedo = new Discord.MessageEmbed().setTitle(`Level ${level} ${name}`).addField("__Details__", `**XP**: ${xp}\n**Types**: ${types.toString().replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}\n**Nature**: ${nature}\n${userx.pokemons[x].helditem !== undefined ? `**Held Item** : ${helditem == [] ? "/-/" : helditem}` : ""}`).addField("__Stats__", `**HP**: ${hpTotal} - IV: ${hp}/31\n**Attack**: ${atkTotal} - IV: ${atk}/31\n**Defense**: ${defTotal} - IV: ${def}/31\n**Sp. Atk**: ${spatkTotal} - IV: ${spatk}/31\n**Sp. Def**: ${spdefTotal} - IV: ${spdef}/31\n**Speed**: ${speedTotal} - IV: ${speed}/31\n**Total IV%**: ${totalIV}%`).setFooter(`Displaying Pokémon: ${x + 1}/${userx.pokemons.length
            }\nOwner: ${interaction.user.tag}`).setImage(url).setColor("RANDOM").setThumbnail(interaction.user.displayAvatarURL())



        return interaction.followUp({ embeds: [Embedo] });
    }
};