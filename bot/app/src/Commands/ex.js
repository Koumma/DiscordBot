/** @format */

const Command = require("../Structures/Command.js");
const cp = require('child_process');


module.exports = new Command({
    name: "autre",
    aliases: ["a"],
    description: "Informations sur le bot",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {

        let {uptime} = getUptime();


    }
});

