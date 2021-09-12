const { Client, Message, MessageEmbed } = require("discord.js");
const { pagination } = require("reconlx")

module.exports = {
  name: "help",
  description: 'Return bot\'s help menu!',
  aliases: [],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

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
      channel: message.channel,
      author: message.author,
      time: 60000,
      pageTravel: true,
    })
  },
};
