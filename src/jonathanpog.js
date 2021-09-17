const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, MessageAttachment } = require('discord.js');
const {token,  prefix, mainChannel} = require('../config/config.json');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES
    ]
});


//const https = require('https');
//const jsdom = require("jsdom");

let database;




module.exports = class jonathanpog {

    constructor(db) {
        client.commands = new Collection();
        getCommands();
        //client.prefix = new Discord.Collection();
        database = db;
    }

    init() {
        onceReady();
        onMessageCreate();
        onInteractionCreate();
        login();
    }
}


// Get all commands
function getCommands() {
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./src/Commands/${file}`);
        // Set a new item in the Collection
        // With the key as the command name and the value as the exported module
        client.commands.set(command.data.name, command);
    }
}


// When the client is ready, run this code (only once)
function onInteractionCreate() {
    client.on('interactionCreate', async interaction => {
        console.log("interaction...");
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        console.log(command);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: `There was an error while executing the command ${interaction.commandName}!`, ephemeral: true});
        }
    });
}


function onMessageCreate() {
    client.on('messageCreate', async message => {
        console.log("message...");
        if (message.author.bot) return;

        let args;

        if (message.channel.type === "DM") {
            client.channels.cache.get(mainChannel).send(message.author.username + " : " + message.content);
        }

        if (message.content.startsWith(prefix)) {
            args = message.content.slice(prefix.length).split(' ');
        }
        else if (message.mentions.users.first() !== undefined && client.user.id === message.mentions.users.first().id) {

        }
        else {
            return console.log(message.content);
        }




        const command = client.commands.get(message.commandName);
        try {
            await command.execute(args.shift().toLowerCase());
        } catch (error) {
            console.error(error);
            await message.reply({content: `There was an error while executing the command ${interaction.commandName}!`, ephemeral: true});
        }


    });
}


function onceReady() {
    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!\nReady!` );
    });
}


// Login to Discord with the client's token
function login(){
    client.login(token).then(r => {
        console.log("Connection...");
    }).catch(error => {
        console.log(`There was an error while attempting to connect to discord!${error}`)
    });
}



