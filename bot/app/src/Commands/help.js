/** @format */

const Command = require("../Structures/Command.js");

const Discord = require("discord.js");

module.exports = new Command({
    name: "help",
    aliases: ["h"],
    description: "Affiche cette aide",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {

        let commands = "";
        let description = "";
        const prefix = `Le prefix actuel de ${client.user.username} est \`\`${client.prefix}\`\`.`;

        client.commands.forEach(cmd => {
            let aliases = "";
            for (let i = 0 ; i < cmd.aliases.length; i++) {
                if (i === 0 && cmd.aliases.length !== 0) aliases += "| ";
                aliases += `\`\`${cmd.aliases[i]}\`\``;
                if (i < cmd.aliases.length-1) aliases += " | ";
            }

            commands += `\`\`${cmd.name}\`\` ${aliases} - ${cmd.description}.\n`;
        })


        let embed = new Discord.MessageEmbed();

        embed.setAuthor(client.user.username, client.user.avatarURL());
        embed.setColor(15767320);
        embed.addField("Commands", commands, true);
        embed.addField("Prefix", prefix);

        await message.channel.send({embeds: [embed]})
    }
});
