const {Client, CommandInteraction , MessageActionRow, MessageButton} = require("discord.js");
const Discord = require('discord.js')
const Pokemon = require('../../db/pokemons.js');

module.exports = {
    name: "dex",
    description : "Displays Pokedex!",
    options : [
        {
            name : "pokemon",
            description : "Provide a Pokémon name to dex!",
            type : 3,
            required : true
        }
    ],
    run: async (client, interaction, args) => {

        const [ pokemon ] = args
        // console.log(pokemon)
        let poke = Pokemon.find(x=> x.name.english.toLowerCase() == `${pokemon.toLowerCase()}`) 

        if (poke == undefined) return interaction.followUp({content: "`"  + pokemon + "`" + " doesn't seem to exist or maybe you spelled it wrong!"});


        
        let embed = new Discord.MessageEmbed()
        .setAuthor(`${client.user.username} - Pokédex`)
        .setTitle(`#${poke.id} -- ${poke.name.english.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())}`)
        .setThumbnail(client.user.displayAvatarURL())
        .setColor('RANDOM')


        interaction.followUp({embeds: [embed]});
    }
};
