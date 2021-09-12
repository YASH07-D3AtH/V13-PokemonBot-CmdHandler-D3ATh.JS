const { Client, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "profile",
    description: "Displays your profile!",
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id });
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        if (!user.createdAt || !isNaN(user.createdAt)) user.createdAt = new Date();
        await user.save();
        var time = user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        time = new Date(time).toISOString()
        time = time.replace("-", "T")
        time = time.replace("-", "T")
        time = time.split("T")
        time = `${time[2]}/${time[1]}/${time[0]}`;


        let selected;
        if (user.selected == undefined) selected = 'None'
        else if (user.selected == null) selected = 'None'
        else {
            var name = user.pokemons[user.selected].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())
            selected = `L${user.pokemons[user.selected].level} ${user.pokemons[user.selected].shiny ? "⭐ " : ""}${name} N${user.selected}`
        }

        let embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`${interaction.user.tag}'s Profile`)
            .setDescription(
                `> **Balance:** ${user.balance.toLocaleString()} ${user.balance <= 1 ? "cr" : "crs"}\n`
                + `> **Redeems:** ${user.redeems.toLocaleString()}\n`
                + `> **Shards**: ${user.shards.toLocaleString()}\n`
                + `> **Pokemons Caught:** ${user.caught.length.toLocaleString()} \n`
                + `> **Shinies Caught**: ${user.shinyCaught.toLocaleString()}\n`
                + `> **Total Shinies:** ${user.pokemons.filter(r => r.shiny).length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`
                + `> **Pokemons Released**: ${user.released.toLocaleString()}\n`
                + `> **Total Pokémons**: ${user.pokemons.length.toLocaleString()}\n`
                + `> **Selected Pokemon**: ${selected}\n`
                + `> **Vote Streak**: ${user.upvotes.toLocaleString()}\n`
                + `> **XP Booster**: -\n`
                + `> **Shiny Charm Expires**: -\n`
                + `> **Badges**: ${user.badges.map(r => { return client.emojis.cache.get(r) }).join(" | ") || "None"}`)

            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter("Started " + client.user.username + " On | " + time)

        return interaction.followUp({ embeds: [embed] });
    }
};
