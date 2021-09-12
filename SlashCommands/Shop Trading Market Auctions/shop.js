const { Client, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "shop",
    description: "Displays the Shop Menu!",
    options: [
        {
            name: "number",
            description: "Provide the shop number which you want to see!",
            type: 3,
            required: false,
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
        }
    ],
    run: async (client, interaction, args, color) => {

        let prefix = "/"

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })


        if (!args[0]) {

            let embed = new MessageEmbed()
                .setColor(color)
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\n🛒 ・  ${client.user.username} Shop`)
                .setDescription(`**See a specific shop page by using the \`/shop [page]\` command.**`)
                .addField("1 | Level", `\`XP Boosters & Rare Candies\``)
                .addField("2 | Evolution", `\`Rare Stones & Evolution Items\``)
                .addField("3 | Natures", `\`Nature Modifiers\``)
                .addField("4 | Items", `\`Held Items\``)
                .addField("5 | Pokémon Forms", `\`Forms & Transformations\``)
                .addField("6 | Gigantamax", `\`Gigantamax Transformations\``)
                .addField("7 | Shards", `\`Shards Exchange\``)
                .setThumbnail(client.user.displayAvatarURL())
            return interaction.followUp({ embeds: [embed] })

        } else if (args[0]) {

            if (args[0].split(" ").length >= 2) return interaction.followUp({ content: `Cmon Dude! You don't wanna see ${args[0].split(" ").length} shops at once!\n\`${prefix}shop [number]\`` })
            let shopnumber = parseInt(args[0].split(" ")[0])
            if (!Number(shopnumber)) {
                return interaction.followUp({ content: "Failed to convert `Parametre` to `String`." })
            }
            if (shopnumber == 1) {

                let embed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 1 - XP Boosters & Rare Candies`)
                    .setDescription(`Get XP boosters to increase your XP gain from chatting and battling!`)
                    .addField("30 Minutes - 2X Multiplier | Cost:  20 Credits", `\`${prefix}buy shop: 1 item: 30m [amount:]\``)
                    .addField("1 Hour - 2X Multiplier | Cost:  40 Credits", `\`${prefix}buy shop: 1 item: 1h [amount:]\``)
                    .addField("2 Hours - 2X Multiplier | Cost:  70 Credits", `\`${prefix}buy shop: 1 item: 2h [amount:]\``)
                    .addField("3 Hours - 2X Multiplier | Cost:  90 Credits", `\`${prefix}buy shop: 1 item: 3h [amount:]\``)
                    .addField("Rare Candy | Cost:  75 Credits/Each", `Rare candies level up your selected pokémon by one level for each candy you feed it.\n\`${prefix}buy shop: 1 item: candy [amount:]\``)
                    .setThumbnail(client.user.displayAvatarURL())

                return interaction.followUp({ embeds: [embed] })
            } else if (shopnumber == 2) {

                return interaction.followUp({ embeds: [embed] })
            } else if (shopnumber == 3) {

                let embed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 3 - Nature Mints`)
                    .setDescription(`Nature modifiers change your selected pokémon's nature to a nature of your choice for credits. Use \`${prefix}buy shop: 3 item: nature [name]\` to buy the nature you want!\n\n**All nature modifiers cost 50 credits**.`)
                    .addField("Adamant Mint", '\`+10% Attack\n-10% Sp. Atk\`', true)
                    .addField("Bashful Mint", '\`No Effect\`', true)
                    .addField("Bold Mint", '\`+10% Defense\n-10% Attack\`', true)
                    .addField("Brave Mint", '\`+10% Attack\n-10% Speed\`', true)
                    .addField("Calm Mint", '\`+10% Sp. Def\n-10% Attack\`', true)
                    .addField("Careful Mint", '\`+10% Sp. Def\n-10% Sp. Atk\`', true)
                    .addField("Docile Mint", '\`No effect\`', true)
                    .addField("Gentle Mint", '\`+10% Sp. Def\n-10% Defense\`', true)
                    .addField("Hardy Mint", '\`No effect\`', true)
                    .addField("Hasty Mint", '\`+10% Speed\n-10% Defense\`', true)
                    .addField("Impish Mint", '\`+10% Defense\n-10% Sp. Atk\`', true)
                    .addField("Jolly Mint", '\`+10% Speed\n-10% Sp. Atk\`', true)
                    .addField("Lax Mint", '\`+10% Defense\n-10% Sp. Def\`', true)
                    .addField("Lonely Mint", '\`+10% Attack\n-10% Defense\`', true)
                    .addField("Mild Mint", '\`+10% Sp. Attack\n-10% Defense\`', true)
                    .addField("Modest Mint", '\`+10% Sp. Attack\n-10% Sp. Atk\`', true)
                    .addField("Naive Mint", '\`+10% Speed\n-10% Sp. Def\`', true)
                    .addField("Naughty Mint", '\`+10% Attack\n-10% Sp. Def\`', true)
                    .addField("Quiet Mint", '\`+10% Attack\n-10% Speed\`', true)
                    .addField("Quirky Mint", '\`No Effect\`', true)
                    .addField("Rash Mint", '\`+10% Sp. Attack\n-10% Sp. Def\`', true)
                    .addField("Relaxed Mint", '\`+10% Defense\n-10% Speed\`', true)
                    .addField("Sassy Mint", '\`+10% Sp. Def\n-10% Speed\`', true)
                    .addField("Serious Mint", '\`No Effect\`', true)
                    .addField("Timid Mint", '\`+10% Speed\n-10% Attack\`', true)
                    .setThumbnail(client.user.displayAvatarURL())

                return interaction.followUp({ embeds: [embed] })
            } else if (shopnumber == 4) {
                let embed = new MessageEmbed()
                    .setColor(color)
                    .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 4 - Held Items`)
                    .setDescription(`Buy items for your pokémon to hold using \`${prefix}buy shop: 4 item: helditem [name]\`\n\n**All these items cost 75 credits.**`)
                    .addField("Everstone", '\`Prevents pokémon from evolving.\`', true)
                    .addField("XP Blocker", '\`Prevents pokémon from gaining XP.\`', true)
                    .setThumbnail(client.user.displayAvatarURL())

                return interaction.followUp({ embeds: [embed] })
            } else if (shopnumber == 5) {
                return interaction.followUp({ embeds: [embed] })
            } else if (shopnumber == 6) {
                let embed = new MessageEmbed()
                .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 6 - Gigantamax Transformation`)
                  .setDescription("Some pokémon have different gigantamax evolutions, you can buy them here to allow them to transform.")
                  .addField("Eternatus", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Venusaur", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Charizard", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Blastoise", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Butterfree", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Pikachu", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Meowth", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Machamp", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Gengar", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Kingler", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Lapras", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Eevee", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Snorlax", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Garbodor", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Melmetal", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Rillaboom", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Cinderace", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Inteleon", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Corviknight", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Orbeetle", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Drednaw", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Coalossal", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Flapple", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Sandaconda", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Toxtricity", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Centiskorch", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Hatterene", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Grimmsnarl", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Alcremie", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Copperajah", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Duraludon", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .addField("Urshifu", `\`${prefix}buy shop: 6 item: gigantamax\``, true)
                  .setColor(color)
                  .setThumbnail(client.user.displayAvatarURL()) 

                return interaction.followUp({ embeds: [embed] })
            } else if (shopnumber == 7) {
                let embed = new MessageEmbed()
                    .setAuthor(`Balance: ${user.balance.toLocaleString()}${user.balance <= 1 ? "cr" : "crs"} | Shards: ${user.shards.toLocaleString()}sh | Redeems: ${user.redeems.toLocaleString()}r\nShop 7 - Shards Exchange`)
                    .setDescription("We have a variety of items that you can purchase using Shards.")
                    .addField("Redeem - 200 Shards/Each", `Get any Spawnable Pokémon of your choice.\n\`${prefix}buy shop: 7 item: redeem \``)
                    .addField("Incense - 1000 Shards/180n", `Increase Spawn Rate by 33.3% for 180 Spawns.\n\`${prefix}buy shop: 7 item: incense \``)
                    .addField("Pokémons - 100 Shards/10n", `Get 10 rare Pokémons with random stats.\n\`${prefix}buy shop: 7 item: pokemon \``)
                    .setColor(color)
                    .setFooter("Shards are premium currency and can be obtained by Donating IRL Money.")
                    .setThumbnail(client.user.displayAvatarURL())

                return interaction.followUp({ embeds: [embed] })
            } else {
                return

            }
        }
    }
}