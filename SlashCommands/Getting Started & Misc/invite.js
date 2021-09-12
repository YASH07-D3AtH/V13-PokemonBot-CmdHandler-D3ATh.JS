const {Client, CommandInteraction , MessageActionRow, MessageButton} = require("discord.js");
const Discord = require('discord.js');


module.exports = {
    name: "invite",
    description: "Returns Bot's Invite Link.",

    run: async (client, interaction, args, color, prefix) => {
        
        let embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Invite`)
        .setDescription(`**Invite The Bot**\n[Click Here](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=2148002881&scope=bot).\n**Support Server**\n[Click Here](https://discord.gg/STNCKPeAUk).`)
        .setColor(color)
        .setThumbnail(client.user.displayAvatarURL())

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setLabel("Support Server")
            .setStyle("LINK")
            .setURL('https://discord.gg/pokecool'),
            new MessageButton()
            .setLabel("Invite Link")
            .setStyle("LINK")
            .setURL('https://discord.com/oauth2/authorize?client_id=863741487073591307&permissions=105495522369&scope=bot%20applications.commands')
        )



        return interaction.followUp({embeds: [embed], components : [row]});
    }
};
