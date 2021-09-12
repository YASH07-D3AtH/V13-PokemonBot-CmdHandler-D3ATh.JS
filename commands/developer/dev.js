const { Message, Client } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "dev_add",
    description: 'Developer Commands',
    aliases: [],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        if (args[0].toLowerCase() == "bal") {

            let amount = parseInt(args[1])

            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel("YES")
                    .setStyle("SUCCESS")
                    .setCustomId("yes"),
                new MessageButton()
                    .setLabel("NO")
                    .setStyle("DANGER")
                    .setCustomId("no")
            )
            message.channel.send({
                content: `Are you sure you want to give ${amount == 0 ? "credit" : "credits"} to \`{u}\` ?`,
                components: [row]
            })

            const filter = (interaction) => {
                if (interaction.user.id == message.author.id) return true
                else return
            }

            const collector = message.channel.createMessageComponentCollector({
                filter, max: 1
            })

            collector.on('end', async (ButtonInteraction) => {
                // await ButtonInteraction.defer().catch(() => { })
                const id = ButtonInteraction.first().customId

                if (id == "yes") return message.channel.send("Success!")
                else if (id == "no") return message.channel.send("Ok Aborted!")
            })

        } else {
            return 
        }


    },
};
