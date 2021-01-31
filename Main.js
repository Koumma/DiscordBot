const {Client} = require('discord.js');
const client = new Client();
const fileName = './config.json'
const config = require(fileName);
const fs = require('fs');
const https = require('https');
let {prefix, token} = config;
const jsdom = require("jsdom");

let FTGmode = 0;
let ethMode = 0;
let interval;

let mainChannel;

function normalize(str, WPMode = 1)
{
    let res = str.toLowerCase()
        .replace(/é/g, "e")
        .replace(/è/g, "e")
        .replace(/î/g, "i")
        .replace(/ï/g, "i")
        .replace(/û/g, "u")
        .replace(/ü/g, "u")
        .replace(/ô/g, "o")
        .replace(/ö/g, "o")
        .replace(/à/g, "a")
        .replace(/â/g, "a")
        .replace(/<b>/g, "")
        .replace(new RegExp("</b>", "g"), "")
        .replace(/<br>/g, "")
    if (WPMode)
        return res.trim();
    else
        return res;
}

function sleep(milliseconds)
{
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function avgPriceItemPromise(item, embed)
{
    return new Promise( (resolve, reject) =>
    {
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
                avgPrice = response.payload.statistics_closed["48hours"][0].avg_price;
                console.log(avgPrice);

                embed.description += "[" + item.name + "](https://warframe.market/items/" +
                    item.name.replace(/ /g, '_').toLowerCase() + ") Ducats : " + item.ducats + " ducats " +
                    "Prix : " + avgPrice + " pl\n";
                resolve(embed);
            });
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            reject(e);
        });

        // l'API de warframe market nous limite à 3 requetes par secondes on doit donc attendre
        sleep(400);
    });

}

client.on('ready', () =>
{
    console.log(`Logged in as ${client.user.tag}!`);

    mainChannel = client.channels.cache.get("638147803985477643");

});

client.on('message', message =>
{
    if (message.author.bot) return;

    if (message.channel.type === "dm") mainChannel.send(message.author.username + " : " + message.content);

    let firstTagged = message.mentions.users.first();

    let checkPrefix = message.content.startsWith(prefix);

    let args = null;

    if (checkPrefix)
    {
        args = message.content.slice(prefix.length).split(' ');
    }
    else if (firstTagged !== undefined && client.user.id === firstTagged.id)
    {
        args = message.content.slice(message.mentions.users.first().id.length + 5).split(' ');
    }
    else
    {
        return;
    }

    let command = args.shift().toLowerCase();

    if (command === "help")
    {
        message.channel.send("prefix, send, join, leave, ftg, cj, r, salut, eth");
    }
    else if (command === "prefix" && args.length === 0)
    {
        message.channel.send("mon prefixe actuel est " + prefix);
    }
    else if (command === "prefix" && args.length > 0)
    {
        config.prefix = args[0];

        let configData = JSON.stringify(config);

        prefix = args[0];

        fs.writeFile("./config.json", configData, () => console.error);

        message.channel.send("j'ai changé mon prefixe en " + prefix);
    }
    else if (command === "send")
    {
        args.shift();
        client.users.cache.get(firstTagged.id).send(args.join(' ')).then( () =>
        {
            console.log("Message envoyé :D");
        });
    }
    else if (command === "leave")
    {
        if (!message.guild.voice || !message.guild.voice.channel) message.channel.send("t'abuses mec faut que je sois dans un salon si tu veux que je le quitte");
        else
        {
            let channel = message.guild.voice.channel;
            channel.leave();
            message.channel.send("j'ai quitté " + channel.name);
        }

    }
    else if (command === "join")
    {
        mainChannel = message.channel;
        let channel = message.member.voice.channel;


        if (!channel) message.channel.send("t'abuses mec faut être dans un salon si tu veux que je le rejoigne");
        else
        {
            channel.join().then( () =>
            {
                message.channel.send("rejoind  " + channel.name);
            });
        }

    }
    else if (command === "ftg")
    {
        if (FTGmode) message.channel.send("c'est bon vous pouvez parler :D");
        else message.channel.send("roi du silence");
        FTGmode = !FTGmode;
    }
    else if (command === "conjugaison" || command === "cj")
    {
        // let modeAffichage = "";
        // let tempsAffichage = "";
        // const modesVerbaux = ["indicatif", "conditionnel", "subjonctif", "imperatif", "infinitif", "participe", "gerondif"];
        // const tempsVerbaux = ["present", "passe compose", "imparfait", "plus-que-parfait", "passe simple", "passe anterieur",
        //     "futur simple", "futur anterieur", "passe"];


        let verbe = args[0];

        if (args.length === 2)
        {
            verbe = [args[0], args[1]].join('_');
            // if (args.length === 3)
            // {
            //     if (modesVerbaux.includes(args[2]))
            //     {
            //         modeAffichage = args[2];
            //     }
            // }
            // if (args.length === 4)
            // {
            //     if (tempsVerbaux.includes(args[3]))
            //     {
            //         tempsAffichage = args[3];
            //     }
            // }
        }
        // else
        // {
        //     message.channel.send("```Utilisation :\n" +
        //         "{prefix}(conjugaison | cj) (verbe à conjuger (peut être en 2 mots exemple : se doucher)) (mode et temps de conjugaison exemple : indicatif présent)```");
        //     return;
        // }

        console.log("Verbe : " + verbe);

        const options =
            {
                host: 'la-conjugaison.nouvelobs.com',
                path: '/du/verbe/' + verbe + '.php'
            };

        https.get(options, function(res)
        {
            console.log("Got response: " + res.statusCode);

            let html = "";

            res.on('data', (chunk) => {
                html += chunk;
            });

            res.on('end', () => {

                if (res.statusCode === 200)
                {
                    html = html.replace(/ +(?= )/g, '');

                    let htmlDebut = "<html lang='fr'><head><title>test</title><meta charset='utf-8'></head><body>";
                    let htmlFin = "</body></html>";

                    let indexD = html.indexOf('<div id="gauche">');
                    let indexF = html.indexOf('<div id="droite">') - 1;

                    /* récupération de l'element div gauche qui contient toutes les infos
                    *
                    *  et création d'un element DOM à partir du code html récupéré
                    *
                    */
                    let htmlDOM = new jsdom.JSDOM(htmlDebut + html.substring(indexD, indexF) + htmlFin);
                    let doc = htmlDOM.window.document;


                    let all = doc.getElementsByTagName("*");

                    /* nettoyage de tous les éléments indesirables */
                    [...all].forEach((node) =>
                    {
                        if (node.nodeName === "IMG" || node.className === "spacer" || node.id === "dfp-inread"
                            || node.nodeName === "A" || node.nodeName === "UL" || node.className === "OUTBRAIN")
                        {
                            node.parentNode.removeChild(node);
                        }
                    });

                    let allChilds = doc.getElementById("contenu").childNodes;

                    /* nettoyage de tous les elements inutiles fils du div (contenu) */
                    allChilds.forEach((node) =>
                    {
                        if (node.className !== "mode" && node.className !== "tempstab" && node.id !== "gauche" && node.id !== "contenu"
                            && node.nodeName !== "HTML" && node.nodeName !== "HEAD" && node.nodeName !== "TITLE"
                            && node.nodeName !== "META" && node.nodeName !== "BODY")
                        {
                            node.parentNode.removeChild(node);
                        }
                    });

                    let o_verbes = [];

                    /* on boucle sur tous les elements et on rempli les tableaux */
                    let res = doc.getElementsByTagName("*");
                    let currentMode = "";
                    let currentTemps = "";

                    let o_verbe =
                        {
                            nom : verbe,
                            mode : []
                        };

                    [...res].forEach((node) =>
                    {
                        if (node.nodeName === "H2" && node.className === "mode")
                        {
                            currentMode = normalize(node.firstChild.innerHTML);
                            console.log(currentMode);

                            let o_mode =
                                {
                                    nom : currentMode,
                                    temps : []
                                };

                            o_verbe.mode.push(o_mode);

                        }
                        if (node.nodeName === "DIV" && node.className === "tempstab")
                        {
                            currentTemps = normalize(node.firstChild.innerHTML);
                            console.log(currentTemps);

                            let o_temps =
                                {
                                    nom : currentTemps,
                                    valeur : null
                                };

                            o_verbe.mode[o_verbe.mode.length - 1].temps.push(o_temps);

                        }
                        if (node.nodeName === "DIV" && node.className === "tempscorps")
                        {
                            let corps = node.innerHTML.replace(/<b>/g, "")
                                .replace(new RegExp("</b>", "g"), "");

                            let tabConjugaison = corps.split("<br>");

                            tabConjugaison = tabConjugaison.filter((e) => e !== "" && e !== "&nbsp;");

                            console.log(tabConjugaison);

                            let temps = o_verbe.mode[o_verbe.mode.length - 1].temps;

                            temps[temps.length - 1].valeur = tabConjugaison;
                        }
                    });

                    o_verbes.push(o_verbe);


                    // for (let i = 0; i < o_verbe.mode.length / 4; i++)
                    // {
                    // indicatif uniquement pour l'instant
                    message.channel.send("```json" + JSON.stringify(o_verbe.mode[0].temps, null, 2) + "```");
                    // }


                    console.log(JSON.stringify(o_verbes, null, 2));
                }
                else
                {
                    message.channel.send("je n'ai pas réussi à trouver votre verbe");
                }

            });

        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });

    }
    else if (command === "salut")
    {
        let author = message.author;

        let embed = {
            "title": "salut",
            "description": "je\n[clique ici stp c'est vraiment cool :D](http://perso.numericable.fr/cansell.dominique/exodc.pdf)",
            "color": 3208301,
            "thumbnail": {
                "url": author.avatarURL()
            },
            "timestamp": message.createdAt,
            "footer": {
                "text": "pied texte"
            },
            "author": {
                "name": author.username,
                "icon_url": author.avatarURL()
            },
            "fields": [
                {
                    "name": "nous",
                    "value": "oui tres\nsexxxxxxx"
                },
                {
                    "name": "<:getdosched:675429413848088576>",
                    "value": "présent de l'indicatif",
                    "inline": true
                },
                {
                    "name": "<:getdosched:675429413848088576>",
                    "value": " du  ",
                    "inline": true
                },
                {
                    "name": "<:getdosched:675429413848088576>",
                    "value": "je suis soos",
                    "inline": true
                }
            ]
        };
        message.channel.send({ embed });
    }
    else if (command === "relic" || command === "r")
    {
        let relic = "";

        if (args.length === 1) relic = args[0];
        else if (args.length === 2) relic = [args[0], args[1]].join('_');
        else
        {
            message.channel.send("```rentre le nom de la relique, soit sous la forme Meso_D1 soit Meso D1```");
            return;
        }

        /* @var JSON CONTENANT LES ITEMS AVEC LEUR NOMS ET LEUR PRIX EN DUCATS */
        let items = []


        const optionsRelic = {
            host: 'warframe.fandom.com',
            path: '/wiki/' + relic
        };

        https.get(optionsRelic, function(res)
        {
            console.log("WF : Got response: " + res.statusCode);

            let html = "";

            res.on('data', (chunk) =>
            {
                html += chunk;
            });

            res.on('end', () =>
            {

                if (res.statusCode === 200)
                {
                    let htmlDebut = "<html lang='fr'><head><title>relics</title><meta charset='utf-8'></head><body>";
                    let htmlFin = "</body></html>";

                    let indexD = html.indexOf('<div class="mw-parser-output">');
                    let indexF = html.indexOf('<div class="printfooter">') - 1;

                    /* récupération de l'element div mw-parser-output qui contient toutes les infos
                    *
                    *  et création d'un element DOM à partir du code html récupéré
                    *
                    */
                    let htmlDOM = new jsdom.JSDOM(htmlDebut + html.substring(indexD, indexF) + htmlFin);
                    let doc = htmlDOM.window.document;

                    let table = doc.querySelector(".emodtable");

                    let trs = table.firstElementChild.childNodes;

                    let Nodes =
                        [
                            trs[2],
                            trs[4],
                            trs[6],
                            trs[8],
                            trs[10],
                            trs[12]
                        ]


                    Nodes.forEach( e =>
                    {
                        let item =
                            {
                                name : e.firstElementChild.childNodes[2].innerHTML,
                                ducats : e.childNodes[3].childNodes[3].innerHTML
                            }

                        //seule exception
                        if (item.name !== "Forma Blueprint") items.push(item);

                    });

                    let embed =
                        {
                            "title": "voila les items de la relique",
                            "description": "",
                            "color": 7750623,
                            "timestamp": message.createdAt
                        };


                    async function makeSynchronousRequest()
                    {
                        try
                        {

                            for (let i = 0; i < items.length; i++) {
                                let httpPromise = avgPriceItemPromise(items[i], embed);
                                await httpPromise;
                            }

                        }
                        catch (e)
                        {
                            console.log(e);
                        }
                    }

                    (async function ()
                    {
                        await makeSynchronousRequest();
                        message.channel.send({ embed })

                    })();
                }
                else
                {
                    message.channel.send("votre relique n'est pas valide");
                }

            });

        }).on('error', function(e)
        {
            console.log("Got error: " + e.message);
        });

    }
    else if (command === "eth")
    {
        if (ethMode)
        {
            clearInterval(interval);
            ethMode = 0;
            message.channel.send("j'arrete le check");
        }
        else
        {
            if (args.length >= 1 && Number.isInteger(parseInt(args[0])) && parseInt(args[0]) > 1)
            {
                if (args[1] == null || !Number.isFinite(parseFloat(args[1])) || parseFloat(args[1]) < 0.05 || isNaN(parseFloat(args[1]))) args[1] = 10;
                ethMode = 1;
                message.channel.send("je vais vous dire si l'ETH passe en dessous de " + args[0] + " $ toutes les " + parseFloat(args[1]) + " minutes.");


                interval = setInterval( () =>
                {
                    const optionsETH = {
                        host: 'cryptonaute.fr',
                        path: '/crypto-monnaie/ethereum/'
                    };

                    https.get(optionsETH, function(res)
                    {
                        console.log("ETH : Got response: " + res.statusCode);

                        let html = "";

                        res.on('data', (chunk) =>
                        {
                            html += chunk;
                        });

                        res.on('end', () =>
                        {

                            let htmlDebut = "<html lang='fr'><head><title>eth</title><meta charset='utf-8'></head><body>";
                            let htmlFin = "</body></html>";

                            let indexD = html.indexOf('<div class="entry-content typography-copy">');
                            let indexF = html.indexOf('<div class="comments-section single-entry-section">') - 1;

                            /* récupération de l'element div mw-parser-output qui contient toutes les infos
                            *
                            *  et création d'un element DOM à partir du code html récupéré
                            *
                            */
                            let htmlDOM = new jsdom.JSDOM(htmlDebut + html.substring(indexD, indexF) + htmlFin);
                            let doc = htmlDOM.window.document;

                            let price = doc.querySelector(".entry-content").childNodes[3].childNodes[3].firstChild.innerHTML.slice(1);


                            if (parseInt(price) < args[0])
                            {
                                let mentions = "";
                                if (args.length >= 3)
                                {
                                    message.mentions.members.forEach( mention =>
                                    {
                                        mentions += " <@" + mention.id + ">";
                                    });
                                }

                                // console.log("OMG L'ETH PASSE A " + price);
                                message.channel.send("OMG L'ETH PASSE A " + (parseInt(price)) + " $" + mentions);
                            }
                            else
                            {
                                // console.log("non il est à " + price);
                                message.channel.send("non il est à " + (parseInt(price)) + " $");
                            }
                        });
                    });
                }, parseFloat(args[1]) * 60 * 1000);
            }
            else
            {
                message.channel.send("faut donner un prix en dollars et éventuellement un interval");
            }
        }
    }
    else
    {
        message.channel.send('apprent a écritre')
    }

});

client.on("guildMemberSpeaking", (member, speaking) =>
{
    if (FTGmode)
    {
        if (speaking)
        {
            if (mainChannel != null) mainChannel.send("stop parler " + member.displayName);
            member.voice.kick("arrete de parler").then( () =>
            {
                console.log(member.displayName + " parle la attention");
            });
        }
        else
        {
            console.log(member.displayName + " a arreté de parler");
        }
    }
});

client.login(token).then( () =>
{
    console.log("Connexion en cours...");
});
