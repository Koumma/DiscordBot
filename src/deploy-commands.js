const fs = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config/config.json');

const commands = [];
const commandFiles = fs.readdirSync('./src/Commands').filter(file => file.endsWith('.js'));
console.log(commandFiles);
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    console.log(command);
    console.log(command.name);
    commands.push(command.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();