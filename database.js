// database.js
// Destructure Keyv from the module or add .default to target the constructor properly
const { Keyv } = require('keyv'); 

// Creates a local SQLite database file named database.sqlite automatically
const economyDB = new Keyv('sqlite://database.sqlite', { namespace: 'economy' });
const levelingDB = new Keyv('sqlite://database.sqlite', { namespace: 'leveling' });

module.exports = { economyDB, levelingDB };
