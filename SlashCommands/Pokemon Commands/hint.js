const Spawn = require('../../models/spawn.js')
const User = require('../../models/user.js')
const Discord = require("discord.js");
const { MessageEmbed, MessageCollector, Collection } = require("discord.js");

module.exports = {
    name: "hint",
    description: "Get a hint to help you guess the Wild pokemon's name.",
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })


        let spawn = await Spawn.findOne({ id: interaction.channel.id })
        if (!spawn.pokemon[0]) return interaction.followUp({ content: "There is no active spawned pokemon here!" });


        if (spawn.hcool) return interaction.followUp({ content: "You can't use hint this much quickly, please try after few seconds!" })

        let name = spawn.pokemon[0].name.split("")
        let done = []
        name.forEach(e => done.push(e))
        for (var i = 0; i < name.length; i++) {
            let pos = Math.floor(Math.random() * name.length)
            done[done.map((x, i) => [i, x]).filter(x => x[1] == done[pos])[0][0]] = " _ "
        }

        spawn.hcool = true
        await spawn.save()
        setTimeout(async () => {
            spawn.hcool = false
            await spawn.save()
        }, 6000)

        return interaction.followUp({ content: `The wild pokémon is \`${done.join("")}\`!` })

    }
}