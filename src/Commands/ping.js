/** @format */

const Command = require("../Structures/Command.js");

const Discord = require("discord.js");

module.exports = new Command({
    name: "ping",
    aliases: [],
    description: "Affiche le ping du bot",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {
        const m = await message.channel.send(`Ping: ${client.ws.ping} ms.`);

        const msg = message instanceof Discord.CommandInteraction ? await message.fetchReply() : m;

        msg.edit(
            `Ping: ${client.ws.ping} ms.\nMessage Ping: ${
                msg.createdTimestamp - message.createdTimestamp
            }`
        );
    }
});
