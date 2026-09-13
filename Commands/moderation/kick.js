const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('The reason for kicking'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // Restricts to mods
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const member = await interaction.guild.members.fetch(user.id);

        await member.kick(reason);
        await interaction.reply({ content: `✅ **${user.tag}** has been kicked.\n• **Reason:** ${reason}`, ephemeral: false });
    },
};
