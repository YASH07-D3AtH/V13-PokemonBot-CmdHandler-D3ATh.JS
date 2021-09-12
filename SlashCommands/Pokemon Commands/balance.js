const {Client, CommandInteraction , MessageActionRow, MessageButton} = require("discord.js");
const Discord = require('discord.js')
const User = require('../../models/user.js');

module.exports = {
    name: "balance",
    description : "Displays your balance!",
    cooldown : 5,
    run: async (client, interaction, args) => {

        let user = await User.findOne({id: interaction.user.id});
        if(!user) return interaction.followUp({ content : `You must pick your starter pokémon with \`{prefix}start\` before using this command.`})
     

        let embed = new Discord.MessageEmbed()
        .setTitle(`${interaction.user.tag}'s Balance`)
        .setDescription(`You currently have \`${user.balance.toLocaleString()}\` ${user.balance <= 1 ? "credit" : "credits"}!`)
        .setThumbnail(`https://cdn.discordapp.com/attachments/863788674016739348/875570259157979176/1628822589156.png`)
        .setColor("RANDOM")


        return interaction.followUp({embeds : [embed]});
    }
};
