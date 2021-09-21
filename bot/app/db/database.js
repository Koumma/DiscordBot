const mysql = require('mysql');
const util = require('util');
const {dbHost, dbUser, dbPwd, dbName} = require('../config/config.json');
let rows;


function init() {
    return mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPwd,
        database: dbName
    });
}

module.exports = class database {

    // Permet de récupérer les jeux de la base de données
    async getJeu() {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query('Select jeu.titre, jeu.dateFin, jeu.urlImage, jeu.urlVideo, jeu.urlJeu from jeu inner join contient on jeu.idJeu=contient.idJeu inner join bot on contient.idBot=bot.idBot');
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet de récupérer le prefix en fonction du serveur
    async getPrefix(idChannel) {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`Select guild.defPrefix from guild where guild.idGuild = ${idChannel}`);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet de récupérer le prefix en fonction de tous les serveurs
    async getAllPrefix() {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`Select guild.defPrefix, guild.idGuild from guild`);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet de modifier le prefix en fonction du serveur
    async setPrefix(idGuild, pref) {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`CALL updatePrefix('${idGuild}','${pref}', @ok);`);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet d'obtenir le channel par default
    async getDefaultChannel(idChannel) {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`Select guild.defPrefix from guild where guild.id = ${idChannel}`);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet de modifier le channel par default
    async setDefaultChannel(idGuild, idChannel, messageChannelInit) {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`CALL updateDefaultChannel('${idGuild}','${idChannel}','${messageChannelInit}');`);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet d'ajouter un serveur au bot
    async addGuild(idGuild, nameGuild, pref) {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`CALL addGuild("${idGuild}","${nameGuild}","${pref}");`);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet de récupérer l'id du serveur
    async getGuild(nameGuild) {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`Select guild.idGuild, guild.nameGuild, guild.idDefaultChannel, guild.messageChannelInit from guild where guild.nameGuild = "${nameGuild}";`);
        } catch (error) {
            console.log(error);
        } finally {
            con.end();
        }
        return rows;
    }

    // Permet de récupérer l'id de tous les serveurs
    async getAllGuild() {
        let con = init();
        try {
            let query = util.promisify(con.query).bind(con);
            rows = await query(`Select guild.idGuild, guild.nameGuild, guild.idDefaultChannel, guild.messageChannelInit from guild;`);
        } catch (error) {
            console.log(error);
        } finally {
            con.end();
        }
        return rows;
    }

    async getEmbed(){
        try {
            //let query = util.promisify();
            rows = await query(`Select guild.defPrefix from guild where guild.id = ${idChannel}`);
        } finally {
            con.end();
        }
        return rows;
    }


};

/*
constructor() {
    con = mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPwd,
        database: dbName
    });
}*/
/*
getJeu(){
    return new Promise(async function(resolve, reject) {
        let res;
        let resultat = await con.connect(err => {
            if (err) throw err;
            //console.log("Connected!");
            let sql = "Select jeu.titre, jeu.dateFin, jeu.urlVideo from jeu inner join contient on jeu.idJeu=contient.idJeu inner join bot on contient.idBot=bot.idBot";
            res = con.query(sql, (err, result) => {
               if (err) throw err;
               console.log(result[0].titre);
               console.log("result="+result);
               return result;
            });
            console.log("res="+res);
            return res;
        });
        console.log("resultat="+resultat);
    resolve(resultat);
    });
}*/


/*
            sql = "Create table guild (idGuild varchar(20) primary key, idDefaultChannel varchar(20), prefix varchar(12))";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("table guild created");
            });
            sql = "Create table jeu (idJeux int primary key, titre varchar(80), dateFin Date, urlVideo varchar(255))";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("table jeu created");
            });
            sql = "Create table contient (idBot varchar(20) primary key, idJeux int primary key)";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("table contient created");
            });
            */

/*
    sql = "INSERT INTO bot (idBot, status) VALUES (591197832002928660, 'online')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Insertion created");
    });
    sql = "INSERT INTO bot (idBot, status) VALUES (591197832002928660, 'online')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Insertion created");
    });*/

/*
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT status FROM bot", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});*/
//--bot--
//idBot-status-messageTemp

//--guild--
//idGuild-idDefaultChannel-defPrefix

//--jeu--
//idJeu-titre-dateFin-urlVideo

//--contient--
//idBot-idJeu

