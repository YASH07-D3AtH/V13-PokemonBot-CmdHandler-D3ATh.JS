const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Returns bot's ping",

    run: async (client, interaction, args, message) => {
        let circles = {
            green: "<a:greenfire:865919100991045653>",
            yellow: "<a:yellowflame:865994340442832906> ",
            red: "<a:warning:865919101300768779>"
        }
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let botLatency = new Date() - interaction.createdAt;
        let apiLatency = client.ws.ping;

        const pingEmbed = new MessageEmbed()
            .setColor("RANDOM")
            // .setDescription(`Bot Latency: **${botLatency}ms**\nAPI Latency: **${apiLatency}ms**\nUptime: **${days}d ${hours}h ${minutes}m ${seconds}s**`)
            .addField("Bot Latency",
                `${botLatency <= 200 ? circles.green : botLatency <= 400 ? circles.yellow : circles.red} ${botLatency}ms`
                , true
            )
            .addField("API Latency",
                `${apiLatency <= 200 ? circles.green : apiLatency <= 400 ? circles.yellow : circles.red} ${apiLatency}ms`
                , true
            )
            .addField("Client Uptime",
                `${days}d ${hours}h ${minutes}m ${seconds}s`
                , true
            )

        interaction.followUp({ embeds: [pingEmbed] });
    },
};
