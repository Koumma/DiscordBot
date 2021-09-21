/** @format */

const Command = require("../Structures/Command.js");

const Discord = require("discord.js");

module.exports = new Command({
    name: "salut",
    aliases: [],
    description: "Ouais",
    type: "BOTH",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {
        const embed = new Discord.MessageEmbed();

        const user = message instanceof Discord.CommandInteraction ? message.user : message.author;

        embed
            .setTitle("Salut")
            .setDescription("je\n[clique ici stp c'est vraiment cool :D](http://perso.numericable.fr/cansell.dominique/exodc.pdf)")
            .setColor(3208301)
            .setThumbnail(message.author.avatarURL())
            .setTimestamp(message.createdAt)
            .setFooter("pied texte")
            .setAuthor(message.author.username,message.author.avatarURL())
            .addFields(
                {
                    "name": "nous",
                    "value": "oui tres\nsexxxxxxx"
                },
                {
                    "name": "<:getdosched:675429413848088576>",
                    "value": "présent de l'indicatif",
                    "inline": true
                },
                {
                    "name": "<:getdosched:675429413848088576>",
                    "value": " du  ",
                    "inline": true
                },
                {
                    "name": "<:getdosched:675429413848088576>",
                    "value": "je suis soos",
                    "inline": true
                }
            );

        message.reply({ embeds: [embed] });
    }
});