/** @format */

const Command = require("../Structures/Command.js");

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = new Command({
    name: "invite",
    aliases: [],
    description: "Invite le bot sur un serveur",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {
        const inviteLink = "https://discord.com/api/oauth2/authorize?client_id=801484739784998912&permissions=8&scope=bot"

        const button = new MessageButton()
            .setLabel('Invite Me')
            .setURL(inviteLink)
            .setStyle('LINK');

        const row = new MessageActionRow()
            .addComponents(
                button
            );

        await message.reply({content: "Clique sur le bouton pour m'inviter", components :[row]});
    }
});



