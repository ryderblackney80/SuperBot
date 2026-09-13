const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Permanently bans a member from the server.')
        .addUserOption(option => option.setName('target').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for the ban'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const member = await interaction.guild.members.fetch(user.id);

        await member.ban({ reason: reason });
        await interaction.reply({ content: `🔨 **${user.tag}** has been banned.\n• **Reason:** ${reason}` });
    },
};
