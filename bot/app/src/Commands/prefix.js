/** @format */

const Command = require("../Structures/Command.js");
const config = require("../../config/config.json")
const Discord = require("discord.js");
const fs = require("fs");

module.exports = new Command({
    name: "prefix",
    aliases: ["prefixe"],
    description: "Affiche le prefix de ce serveur",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {
        args.shift();

        if (args.length === 0) {
            await message.channel.send(`**${message.author.username}**, le préfixe actuel du serveur est : \`\`${client.prefix}\`\`.`);
        }
        else {
            client.prefix = args[0];
            config.prefix = args[0];
            let configData = JSON.stringify(config);

            fs.writeFileSync("./config/config.json", configData);

            await message.channel.send(`**${message.author.username}**, le préfixe a été sauvegardé avec succès, il est maintenant défini sur : \`\`${client.prefix}\`\`.`);
        }

    }
});
