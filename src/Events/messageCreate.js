/** @format */

const Event = require("../Structures/Event.js");
const {MessageEmbed} = require("discord.js");

module.exports = new Event("messageCreate", (client, message) => {
    if (message.author.bot) return;

    let args = null;

    if (message.content.startsWith(client.prefix)) {
        args = message.content.substring(client.prefix.length).split(/ +/);
    }
    else if (message.mentions.users.first() !== undefined && client.user.id === message.mentions.users.first().id)
    {
        args = message.content.slice(message.mentions.users.first().id.length + 5).split(' ');
    } else return ;


    const arg = args[0].toLowerCase()
    console.log(arg);

    const command = client.commands.find(cmd => {
        if (cmd.name === arg || cmd.aliases.includes(arg)) return cmd
    })

    //let beautyError = new MessageEmbed();
    //beautyError.setDescription("apprent a écritre").setColor(15767320);

    //if (!command) return message.reply({ embeds: [beautyError] });
    if (!command) return message.reply("apprent a écritre");


    if (!["BOTH", "TEXT"].includes(command.type))
        return message.reply(
            "That command is only available via slash command!"
        );

    const permission = message.member.permissions.has(command.permission, true);

    if (!permission)
        return message.reply(
            `You do not have the permission \`${command.permission}\` to run this command!`
        );

    command.run(message, args, client);
});
