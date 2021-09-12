const client = require("../index");
let Guild = require('../models/guild.js');
let cooldown = require('../models/cooldown.js');
const Discord = require('discord.js')


client.on("interactionCreate", async (interaction) => {

    let guild = await Guild.findOne({ id: interaction.guild.id });
    if (!guild) await new Guild({ id: interaction.guild.id }).save();
    guild = await Guild.findOne({ id: interaction.guild.id })
    let prefix = guild.prefix;
    if (prefix == null || prefix == undefined) {
        prefix = "p!"
        await guild.save()
    }
    prefix = "/"
    let color = "#FF35B8"

    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch((error) => {
            return interaction.followUp({ content: error.stack })
        });

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd || cmd == undefined) return interaction.followUp({ content: "No Command found matching this name!" });


        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                    if (x.name) args.push(x.name)
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        
        if (cmd.permission) {

        const permission = interaction.member.permissions.has(cmd.permission)
        if (!permission) return interaction.followUp({content: "You Do Not Have Permission" })
            
        }

        if (cmd.cooldown) {
            const current_time = Date.now();
            const cooldown_amount = (cmd.cooldown) * 1000

            cooldown.findOne({ userId: interaction.member.id, cmd: cmd.name }, async (err, data) => {
                if (data) {
                    const expiration_time = data.time + cooldown_amount;

                    if (current_time < expiration_time) {
                        const time_left = (expiration_time - current_time) / 1000

                        if (time_left.toFixed(1) >= 3600) {
                            let hour = (time_left.toFixed(1) / 3600);
                            return interaction.followUp({ content: `Please wait \`${parseInt(hour)}\` more hours before using **${cmd.name}**!` })
                        }
                        if (time_left.toFixed(1) >= 60) {
                            let minute = (time_left.toFixed(1) / 60);
                            return interaction.followUp({ content: `Please wait \`${parseInt(minute)}\` more minutes before using **${cmd.name}**!` })
                        }
                        let seconds = (time_left.toFixed(1));
                        return interaction.followUp({ content: `Please wait \`${parseInt(seconds)}\` more seconds before using **${cmd.name}**!` })
                    } else {
                        await cooldown.findOneAndUpdate({ userId: interaction.member.id, cmd: cmd.name }, { time: current_time });
                        await cmd.run(client, interaction, args, color, prefix).catch(err => {
                            if ([`versionerror`, `no matching document`, `missing permissions`].includes(err.message.toLowerCase())) return;
                            if (err.message.includes(`404 - "Not Found"`)) return interaction.channel.send({ content: "This Pokémon doesn't seem to appear in the Pokedex or maybe you spelled it wrong!" });
                            return console.log(err.stack)
                        })
                    }
                } else {
                    await cmd.run(client, interaction, args, color, prefix).catch(err => {
                        if ([`versionerror`, `no matching document`, `missing permissions`].includes(err.message.toLowerCase())) return;
                        if (err.message.includes(`404 - "Not Found"`)) return interaction.channel.send({ content: "This Pokémon doesn't seem to appear in the Pokedex or maybe you spelled it wrong!" });
                        return console.log(err.stack)
                    })
                    new cooldown({
                        userId: interaction.member.id,
                        cmd: cmd.name,
                        time: current_time,
                        cooldown: cmd.cooldown,
                    }).save();
                }
            })
        } else {
            try {
                await cmd.run(client, interaction, args, color, prefix).catch(err => {
                    if ([`versionerror`, `no matching document`, `missing permissions`].includes(err.message.toLowerCase())) return;
                    if (err.message.includes(`404 - "Not Found"`)) return interaction.channel.send({ content: "This Pokémon doesn't seem to appear in the Pokedex or maybe you spelled it wrong!" });
                    return console.log(err.stack)
                })
            } catch (error) {
                return interaction.followUp({ content: error.stack })
            }
        }
    }
})
