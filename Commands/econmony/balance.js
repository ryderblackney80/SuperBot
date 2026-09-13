const { SlashCommandBuilder } = require('discord.js');
const { economyDB } = require('../../Database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your bank accounts.')
        .addUserOption(option => option.setName('target').setDescription('Target user')),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const key = `${interaction.guild.id}-${user.id}`;
        const data = await economyDB.get(key) || { wallet: 0, bank: 500 }; // Free $500 starting cash

        await interaction.reply({
            content: `🪙 **${user.username}'s Ledger**:\n• **Wallet:** $${data.wallet}\n• **Bank:** $${data.bank}`
        });
    },
};
