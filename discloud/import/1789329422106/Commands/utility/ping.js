const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks the bot latency.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`🏓 Pong!\n• **API Latency:** ${latency}ms\n• **WebSocket Latency:** ${interaction.client.ws.ping}ms`);
    },
};
