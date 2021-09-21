/** @format */

const Command = require("../Structures/Command.js");

const Discord = require("discord.js");
const https = require("https");
const jsdom = require("jsdom");

module.exports = new Command({
    name: "relic",
    aliases: ["r","relique"],
    description: "Liste les items d'une relique",
    type: "TEXT",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {
        let relic = "";
        args.shift();
        if (args.length === 1) relic = args[0];
        else if (args.length === 2) relic = [args[0], args[1]].join('_');
        else {
            message.channel.send("rentre le nom de la relique, soit sous la forme Meso_D1 soit Meso D1");
            return;
        }

        await message.channel.sendTyping().then(await getRelics(message, relic));
    }
});


 function getRelics(message, relic) {
    /* @var JSON CONTENANT LES ITEMS AVEC LEUR NOMS ET LEUR PRIX EN DUCATS */
    let items = []

    const optionsRelic = {
        host: 'warframe.fandom.com',
        path: '/wiki/' + relic
    };

    https.get(optionsRelic, async function (res) {

        console.log("WF : Got response: " + res.statusCode);

        let html = "";

        res.on('data', (chunk) => {
            html += chunk;
        });

        res.on('end', () => {

            if (res.statusCode === 200) {
                let htmlDebut = "<html lang='fr'><head><title>relics</title><meta charset='utf-8'></head><body>";
                let htmlFin = "</body></html>";

                let indexD = html.indexOf('<div class="mw-parser-output">');
                let indexF = html.indexOf('<div class="page-footer">') - 1;

                /* récupération de l'element div mw-parser-output qui contient toutes les infos
                *
                *  et création d'un element DOM à partir du code html récupéré
                *
                */
                let htmlDOM = new jsdom.JSDOM(htmlDebut + html.substring(indexD, indexF) + htmlFin);
                let doc = htmlDOM.window.document;

                const imgData = doc.querySelector(".pi-image");
                const imgUrl = imgData.getElementsByTagName('img')[0].src;

                let table = doc.querySelector(".wikitable");

                let trs = table.firstElementChild.childNodes;

                let Nodes =
                    [
                        trs[2],
                        trs[4],
                        trs[6],
                        trs[10],
                        trs[12],
                        trs[16]
                    ]

                Nodes.forEach(e => {
                    let item =
                        {
                            name: e.firstElementChild.childNodes[2].innerHTML,
                            ducats: e.childNodes[3].firstElementChild.childNodes[1].childNodes[1].textContent
                        }

                    //seule exception
                    if (item.name !== "Forma Blueprint") items.push(item);

                });


                let embed = new Discord.MessageEmbed();
                embed
                    .setTitle("Items de la relique")
                    .setColor(7750623)
                    .setThumbnail("https://logos-world.net/wp-content/uploads/2020/12/Discord-Logo.png")

                let rcomposants = "";
                let rducats = "";
                let rprix = "";

                async function makeSynchronousRequest() {
                    try {
                        for (let i = 0; i < items.length; i++) {
                            await avgPriceItemPromise(items[i]).then(tab => {
                                rcomposants += tab.composants;
                                rducats += tab.ducats;
                                rprix += tab.prix;
                            });
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }

                (async function () {
                    await makeSynchronousRequest();
                    embed.addField("Composants", rcomposants, true);
                    embed.addFields(
                        {
                            name: 'Ducats',
                            value: rducats,
                            inline: true
                        },
                        {
                            name: 'Prix',
                            value: rprix,
                            inline: true
                        }
                    );
                    embed.setThumbnail(imgUrl);
                    embed.setTimestamp(message.createdAt);
                    await message.channel.send( { embeds: [embed] });
                })();
            } else {
                message.channel.send("La relique n'est pas valide");
            }

        });


    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}

function avgPriceItemPromise(item) {
    return new Promise((resolve, reject) => {
        // transforme exemple : "Stradavar Prime Receiver" en "stradavar_prime_receiver"
        let itemURL = item.name.toLowerCase().replace(/ /g, "_").replace(/&amp;/g, "and");

        const optionsItem = {
            host: 'api.warframe.market',
            path: '/v1/items/' + itemURL + '/statistics'
        };

        let avgPrice = 0;

        https.get(optionsItem, (res) => {
            let html = "";
            res.on('data', (chunk) => html += chunk);

            res.on('end', () => {
                console.log("GET on : api.warframe.market/v1/items/" + itemURL + "/statistics --- GOT " + res.statusCode);

                let response = JSON.parse(html);

                /**
                 * @property {string} payload
                 * @property {string} statistics_closed
                 * @property {string} avg_price
                 *
                 * API variables
                 */
                let tab = {
                    composants: "",
                    ducats: "",
                    prix: ""
                };
                try {
                    avgPrice = response.payload.statistics_closed["48hours"][0].avg_price;
                    console.log(avgPrice);
                    tab.composants = "[" + item.name + "](https://warframe.market/items/" +
                        item.name.replace(/ /g, '_').toLowerCase() + ")\n";
                    tab.ducats = item.ducats.slice(1) + " ducats\n";
                    tab.prix = avgPrice + " pl\n";
                    resolve(tab);
                } catch (error) {
                    tab.composants = "[" + item.name + "](https://warframe.market/items/" +
                        item.name.replace(/ /g, '_').toLowerCase() + ")\n";
                    tab.ducats = item.ducats.slice(1) + " ducats\n";
                    tab.prix = "Impossible de récupérer le prix moyen de cet item\n";
                    resolve(tab);
                }

            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            reject(e);
        });

        // l'API de warframe market nous limite à 3 requetes par secondes on doit donc attendre
        sleep(350);
    });
}

function sleep(milliseconds)
{
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


