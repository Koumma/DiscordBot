/** @format */

const Command = require("../Structures/Command.js");
const {version} = require("../../package.json")
const cp = require("child_process");
const {MessageEmbed} = require("discord.js");

module.exports = new Command({
    name: "info",
    aliases: ["i"],
    description: "Informations sur le bot",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {

        let {uptime} = await getUptime();      //let {stdout} = await getVersion();
        console.log(uptime);


        let embed = new MessageEmbed();

        embed.setAuthor(client.user.username, client.user.avatarURL());
        embed.setColor(15767320);
        embed.setThumbnail(client.user.avatarURL());
        embed.addField("Créateurs", "__<@290215560397193227>__\n__<@253212507085340672>__", true);
        embed.addField("Version", version ,true);
        embed.addField('\u200b', '\u200b', true);

        //embed.addField("Serveurs", '\u200b', true);
        //embed.addField("Utilisateurs", '\u200b', true);
        //embed.addField('\u200b', '\u200b', true);

        embed.addField("Uptime", uptime, true);
        embed.addField("Librarie", "Discord.js", true);

        embed.setTimestamp(message.createdAt);

        await message.channel.send({embeds: [embed]})
    }
});


async function getUptime() {
    return new Promise(async function (resolve, reject) {
        let t = "";
        let uptime = "";

        if (process.platform === "linux") {
            const {stdout} = await getTime();
            t = stdout;
        }
        else {
            uptime = "NI"
            resolve({uptime});
        }

        const time = ["jours", "heures", "minutes", "secondes"];

        const tab = t.replace(/[^0-9:-]/g, '').replace('-', ':').split(':');
        tab.forEach((number, i) => {
            if (parseInt(number.charAt(0)) === 0) tab[i] = number.slice(1)
        });
        while (tab.length < 4) tab.unshift("0");


        tab.forEach((v, i) => {
            if (parseInt(v) <= 1) time[i] = time[i].slice(0, -1);
            uptime += `${tab[i]} ${time[i]} `
        });
        console.log(uptime);

        resolve({uptime});
    });
}


async function getTime() {
    return new Promise(function (resolve, reject) {
        cp.exec("ps -o etime= -p '1'", (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}
