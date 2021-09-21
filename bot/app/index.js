/** @format */

console.clear();

const JonathanPog = require("./src/Structures/JonathanPog.js");

const {token} = require("./config/config.json");

const jonathanpog = new JonathanPog();

jonathanpog.start(token);
