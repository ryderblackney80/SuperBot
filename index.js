require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

// Dynamically load command files from categories
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
    }
}

// Listen for slash command execution
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.once('ready', () => {
    console.log(`⚡ ${client.user.tag} is running on your MSI laptop!`);
});

const { levelingDB } = require('./Database.js');

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    const key = `${message.guild.id}-${message.author.id}`;
    let data = await levelingDB.get(key) || { xp: 0, level: 1 };

    // Give random XP between 15 and 25 per message
    data.xp += Math.floor(Math.random() * 11) + 15;
    
    // XP needed to level up formula: (level * 100)
    const xpNeeded = data.level * 100;

    if (data.xp >= xpNeeded) {
        data.xp -= xpNeeded;
        data.level += 1;
        await message.reply(`🎉 GG **${message.author.username}**, you just leveled up to **Level ${data.level}**!`);
    }

    await levelingDB.set(key, data);
});

client.login(process.env.DISCORD_TOKEN);
