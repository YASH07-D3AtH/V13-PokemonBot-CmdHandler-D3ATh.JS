const { Client, CommandInteraction } = require("discord.js");
const Discord = require('discord.js')
const owner = "835771316303822898"

module.exports = {
    name: "stats",
    description: "Returns Bot Statistics.",

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let botLatency = new Date() - interaction.createdAt,
        o = client.users.cache.get(owner).tag
       
    
        let embed = new Discord.MessageEmbed()
          .setAuthor(`${client.user.username} Statistics`)
          .setDescription(`[Official Website](https://google.com) | [Invite Bot](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2148002881&scope=bot) | [Support Server](https://discord.gg/j8nyvXAART)`)
          .addField('<:mania_bot_dev:874334317566885958> Author/Developers',`\`${o}\``)
          .addField("📚 Library", `\`Discord Js ${Discord.version}\``)
          // .addField("⁉️ Default Prefix", `\`.\``, true)
          // .addField("💵 Bot Currency", `\`PokéGold (ツ)\``)
          .addFields(
            {
              name: "📡 Total Guilds: ",
              value: `\`${client.guilds.cache.size} Guilds\``,
              inline: true
            },
            {
              name: "👥 Total Users: ",
              value: `\`${client.users.cache.size} Users\``,
              inline: true
            },
            {
              name: "🖥️ Total Channels: ",
              value: `\`${client.channels.cache.size} Channels\``,
              inline: true
            })
            .addField("⏱️ Uptime", `\`${days}d ${hours}h ${minutes}m ${seconds}s\``,true)
            .addField("🏓 Average Ping Latency", `\`${Math.round(botLatency)}ms\``,true)    
            .setThumbnail(client.user.displayAvatarURL())
            .setColor('RANDOM')
            .setFooter(`Executed by ${interaction.user.username}`)
            .setTimestamp()
            
            interaction.followUp({ embeds: [embed] });
    },
};
