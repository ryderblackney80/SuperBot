const { SlashCommandBuilder, Collection } = require('discord.js');
const { economyDB } = require('../../Database.js');
const cooldowns = new Collection();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Work a shift on your MSI Laptop to earn cash.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        
        // 30 second cooldown check
        if (cooldowns.has(userId)) {
            return interaction.reply({ content: '⏳ You are exhausted! Please wait a moment before working again.', ephemeral: true });
        }

        const key = `${interaction.guild.id}-${userId}`;
        let data = await economyDB.get(key) || { wallet: 0, bank: 500 };

        const jobs = ['Software Engineer', 'Pro Gamer', 'Hardware Modder', 'Crypto Trader'];
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        const payment = Math.floor(Math.random() * 200) + 50; // Earn between $50 and $250

        data.wallet += payment;
        await economyDB.set(key, data);

        cooldowns.set(userId, true);
        setTimeout(() => cooldowns.delete(userId), 30000); // 30 seconds

        await interaction.reply({ content: `💼 You worked as a **${randomJob}** and earned **$${payment}**!` });
    },
};
