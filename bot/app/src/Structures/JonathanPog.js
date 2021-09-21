/** @format */

const Discord = require("discord.js");

const Command = require("./Command.js");

const Event = require("./Event.js");

const config = require("../../config/config.json");

const ALL_INTENTS =
    (1 << 0) +  // GUILDS
//  (1 << 1) +  // GUILD_MEMBERS
    (1 << 2) +  // GUILD_BANS
    (1 << 3) +  // GUILD_EMOJIS_AND_STICKERS
    (1 << 4) +  // GUILD_INTEGRATIONS
    (1 << 5) +  // GUILD_WEBHOOKS
    (1 << 6) +  // GUILD_INVITES
    (1 << 7) +  // GUILD_VOICE_STATES
//  (1 << 8) +  // GUILD_PRESENCES
    (1 << 9) +  // GUILD_MESSAGES
    (1 << 10) + // GUILD_MESSAGE_REACTIONS
    (1 << 11) + // GUILD_MESSAGE_TYPING
    (1 << 12) + // DIRECT_MESSAGES
    (1 << 13) + // DIRECT_MESSAGE_REACTIONS
    (1 << 14);  // DIRECT_MESSAGE_TYPING

const intents = new Discord.Intents(ALL_INTENTS);

const fs = require("fs");

class JonathanPog extends Discord.Client {
    constructor() {
        super({ intents });

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.aliases = new Discord.Collection();

        this.prefix = config.prefix;
    }

    start(token) {
        // Command Handler
        const commandFiles = fs.readdirSync("./src/Commands")
            .filter(file => file.endsWith(".js"));
        console.log(commandFiles);

        /**
         * @type {Command[]}
         */
        const commands = commandFiles.map(file => require(`../Commands/${file}`));

        commands.forEach(cmd => {
            console.log(`Command ${cmd.name} loaded`);
            this.commands.set(cmd.name, cmd);
        });


        /*
        const slashCommands = commands
            .filter(cmd => ["BOTH", "SLASH"].includes(cmd.type))
            .map(cmd => ({
                name: cmd.name.toLowerCase(),
                description: cmd.description,
                permissions: [],
                options: cmd.slashCommandOptions,
                defaultPermission: true
            }));
        */

        // Event Handler
        this.removeAllListeners();

        this.on("ready", async () => {
            //const cmds = await this.application.commands.set(slashCommands);
            //cmds.forEach(cmd => console.log(`Slash Command ${cmd.name} registered`));
        })

        fs.readdirSync("./src/Events")
            .filter(file => file.endsWith(".js"))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../Events/${file}`);
                console.log(`Event ${event.event} loaded`);
                this.on(event.event, event.run.bind(null, this));
            });

        this.login(token);
    }
}

module.exports = JonathanPog;
