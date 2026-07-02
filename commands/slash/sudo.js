const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');
const { isOwner } = require('../../utils/sudo/auth');
const router = require('../../utils/sudo/router');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sudo')
        .setDescription('Developer Panel')

        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Developer command category')
                .setRequired(true)
                .addChoices(
                    { name: 'System', value: 'system' }
                )
        )

        .addStringOption(option =>
            option
                .setName('action')
                .setDescription('Developer action')
                .setRequired(true)
                .addChoices(
                    { name: 'Status', value: 'status' }
                )
        ),

    securityToken: COMMAND_SECURITY_TOKEN,
    hidden: true,

    async execute(interaction, client) {

        if (!isOwner(interaction.user.id)) {
            const embed = new EmbedBuilder()
                .setDescription('❌ You do not have permission to use this command!')
                .setColor('#FF0000');

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('❌ System core offline - Command unavailable')
                .setColor('#FF0000');

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {

            const category = interaction.options.getString('category');
            const action = interaction.options.getString('action');

            const result = await router.execute(category, action, client);

            const embed = new EmbedBuilder()
                .setColor(result.success ? 0x9966ff : 0xFF0000)
                .setTitle(result.title || 'Uta Developer Panel')
                .setDescription(result.description)
                .setFooter({
                    text: 'Uta Music Bot • Developed By Luffy',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            return interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {

            console.error('Sudo command error:', error);

            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('❌ An unexpected error occurred while executing the command.')
                .setFooter({
                    text: 'Uta Music Bot • Developed By Luffy',
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            return interaction.editReply({
                embeds: [embed]
            });

        }

    }
};