const { SlashCommandBuilder } = require('discord.js');
const { levelingDB } = require('../../Database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Displays your current level and XP.')
        .addUserOption(option => option.setName('target').setDescription('Check someone else\'s rank')),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const key = `${interaction.guild.id}-${user.id}`;
        const data = await levelingDB.get(key) || { xp: 0, level: 1 };

        const xpNeeded = data.level * 100;
        await interaction.reply({
            content: `📊 **${user.username}'s Rank Profile**:\n• **Level:** ${data.level}\n• **XP:** ${data.xp} / ${xpNeeded}`
        });
    },
};
