/** @format */

const Command = require("../Structures/Command.js");

const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

const beschrelle = require("conjugation-fr");
const {UnknownTenseError} = require("conjugation-fr");
const {UnknownModeError} = require("conjugation-fr");
const {UnknownVerbError} = require("conjugation-fr");

module.exports = new Command({
    name: "conjugaison",
    aliases: ["cj","conjug"],
    description: "Conjugue un verbe dans tous ses temps",
    type: "BOTH",
    slashCommandOptions: [],
    permission: "SEND_MESSAGES",
    async run(message, args, client) {

        args.shift();
        let verb = null;
        let mode = "indicative";
        let tense = "anterior-future";
        let fgender = false;

        if(args.includes('-e')) {
            for (let i = 0; i < args.length; i++) {
                if (args[i] === "-e"){
                    args.splice(i,1);
                    i--;
                }
            }
            fgender=true;
        }

        if (args.length === 1) verb = args[0];
        else return message.reply("Renseigne un verbe à l'infinitif");


        await getTemps(message, verb, fgender);
    }
});

async function getTemps(message, verb, fgender) {
    const modeVerbauxFR = [ "INDICATIF", "CONDITIONNEL", "SUBJONCTIF", "IMPÉRATIF", "PARTICIPE", "INFINITIF" ];
    const modeVerbaux = [ "indicative", "conditional", "subjunctive", "imperative", "participle", "infinitive" ];
    const tempsVerbauxFR =
        [
            [
                "présent",
                "imparfait",
                "futur",
                "passé simple",
                "passé composé",
                "plus-que-parfait",
                "passé antérieur",
                "futur antérieur"
            ],
            [
                "présent",
                "passé"
            ],
            [
                "présent",
                "imparfait",
                "passé",
                "plus-que-parfait"
            ],
            [
                "présent",
                "passé"
            ],
            [
                "présent",
                "passé"
            ],
            [
                "présent"
            ]
        ];
    const tempsVerbaux =
        [
            [
                "present",
                "imperfect",
                "future",
                "simple-past",
                "perfect-tense",
                "pluperfect",
                "anterior-past",
                "anterior-future"
            ],
            [
                "present",
                "conditional-past"
            ],
            [
                "present",
                "imperfect",
                "subjunctive-past",
                "subjunctive-pluperfect"
            ],
            [
                "imperative-present",
                "imperative-past"
            ],
            [
                "present-participle",
                "past-participle"
            ],
            [
                "infinitive-present",
            ]
        ];

    let i = 0
    let j = 0
    let secondPart=false;
    try {
        let embed1 = new MessageEmbed();
        let embed2 = new MessageEmbed();

        embed1.setDescription(`${message.author.username}, voici la conjugaison du verbe **${verb}**`);
        embed1.setColor("ORANGE");

        for(i = 0; i < modeVerbaux.length; i++) {
            let tempsConjuge = null;
            tempsConjuge = [];

            if (i === 2) {
                secondPart=true;
                embed2.setColor("ORANGE");
            }

            if (secondPart) embed2.addField(modeVerbauxFR[i], "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");
            else embed1.addField(modeVerbauxFR[i], "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬");

            for(j = 0; j < tempsVerbaux[i].length; j++) {

                let conjugaison = "";
                let tabConjug = beschrelle.conjugate(verb, modeVerbaux[i], tempsVerbaux[i][j], fgender);

                tabConjug.forEach(line => {
                    if (line.pronoun === "i") conjugaison += `${line.verb}\n`;
                    else if (line.pronoun !== "j'") conjugaison += `${line.pronoun} ${line.verb}\n`;
                    else conjugaison += `${line.pronoun}${line.verb}\n`;
                });
                tempsConjuge.push({t:tempsVerbauxFR[i][j], c:conjugaison});
            }


            if (secondPart) {
                for (let k=1; k<=tempsConjuge.length; k++) {
                    if (k + 1 <= tempsConjuge.length) {
                        embed2.addFields(
                            {
                                name: tempsConjuge[k - 1].t,
                                value: tempsConjuge[k - 1].c,
                                inline: true
                            },
                            {
                                name: tempsConjuge[k].t,
                                value: tempsConjuge[k].c,
                                inline: true
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true
                            }
                        );
                        k++;
                    } else {
                        embed2.addField(tempsConjuge[k - 1].t, tempsConjuge[k - 1].c, true);
                    }
                }
            }
            else {
                for (let k=1; k<=tempsConjuge.length; k++) {
                    if (k + 1 <= tempsConjuge.length) {
                        embed1.addFields(
                            {
                                name: tempsConjuge[k - 1].t,
                                value: tempsConjuge[k - 1].c,
                                inline: true
                            },
                            {
                                name: tempsConjuge[k].t,
                                value: tempsConjuge[k].c,
                                inline: true
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true
                            }
                        );
                        k++;
                    } else {
                        embed1.addField(tempsConjuge[k - 1].t, tempsConjuge[k - 1].c, true);
                    }
                }
            }

            if (i<1) embed1.addField('\u200b', '\u200b');
            if (i>=2 && i<modeVerbaux.length-1) embed2.addField('\u200b', '\u200b');
            if (i===modeVerbaux.length-1) {
                embed2.setDescription("\u200b");
                embed2.setTimestamp(message.createdAt);
            }
        }

        await message.channel.send({embeds: [embed1, embed2] });

    } catch (error) {
        if (error instanceof UnknownVerbError) await message.reply(`Le verbe \`\`${verb}\`\` n'existe pas.`);
        else {
            await message.channel.send(`Une erreur s'est produite lors de l'execution de cette commande`);
            console.log(error);
        }
    }
}
