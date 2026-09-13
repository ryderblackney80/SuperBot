const { SlashCommandBuilder } = require('discord.js');
const { economyDB } = require('../../Database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .setDescription('Attempt to steal from another user\'s wallet.')
        .addUserOption(option => option.setName('target').setDescription('The user to rob').setRequired(true)),
    async execute(interaction) {
        const victim = interaction.options.getUser('target');
        if (victim.id === interaction.user.id) return interaction.reply({ content: 'You cannot rob yourself!', ephemeral: true });

        const guildId = interaction.guild.id;
        const thiefKey = `${guildId}-${interaction.user.id}`;
        const victimKey = `${guildId}-${victim.id}`;

        let thiefData = await economyDB.get(thiefKey) || { wallet: 0, bank: 500 };
        let victimData = await economyDB.get(victimKey) || { wallet: 0, bank: 500 };

        if (victimData.wallet < 50) {
            return interaction.reply({ content: `❌ **${victim.username}** is too poor to rob right now (must have at least $50 in wallet).`, ephemeral: true });
        }

        // 50% chance of success
        const success = Math.random() > 0.5;

        if (success) {
            const stolenAmount = Math.floor(Math.random() * (victimData.wallet / 2)) + 10; // Steal up to half their cash
            victimData.wallet -= stolenAmount;
            thiefData.wallet += stolenAmount;

            await economyDB.set(thiefKey, thiefData);
            await economyDB.set(victimKey, victimData);

            await interaction.reply({ content: `🥷 **Success!** You sneaked into **${victim.username}'s** wallet and made off with **$${stolenAmount}**!` });
        } else {
            const fine = 100;
            thiefData.wallet = Math.max(0, thiefData.wallet - fine);
            await economyDB.set(thiefKey, thiefData);

            await interaction.reply({ content: `🚨 **Caught red-handed!** You failed the heist and were fined **$${fine}**.` });
        }
    },
};
