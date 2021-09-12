const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const { pagination } = require('reconlx')

module.exports = {
    name: "help",
    description: "Display the help menu!",
    options: [
        {
            name: "page",
            description: "Provide page number to jump to!",
            type: 4,
            required: false
        }
    ],
    run: async (client, interaction, args) => {



        let embed = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed1 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed2 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed3 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed4 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed5 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed6 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')
        let embed7 = new MessageEmbed()
            .setAuthor(`${client.user.username} -- Help`)
            .setColor('RANDOM')

        if (!args[0]) {
            const Embeds = [
                embed,
                embed1,
                embed2,
                embed3,
                embed4,
                embed5,
                embed6,
                embed7
            ]

            pagination({
                embeds: Embeds,
                channel: interaction.channel,
                author: interaction.user,
                time: 60000,
                pageTravel: true,
            })
            return interaction.followUp({ content: "**Help Menu:**" })
        } else if (args[0]) {
            let page = args[0]
            if (page == 0) {

            } else if (page == 1) {

            } else if (page == 2) {

            } else if (page == 3) {

            } else if (page == 4) {

            } else if (page == 5) {

            } else if (page == 6) {

            } else if (page == 7) {

            } else if (page == 8) {

            } else {
                return interaction.followUp({ content : `\`${number}\` page does't exist in help menu!`})
            }
        } else {
            return
        }
    } 
}
