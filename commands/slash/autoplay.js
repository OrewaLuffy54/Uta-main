const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Server = require('../../models/Server');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Toggle autoplay mode')
        .addBooleanOption(option =>
            option.setName('enabled')
                .setDescription('Enable or disable autoplay')
                .setRequired(true)
        ),
    securityToken: COMMAND_SECURITY_TOKEN,

    async execute(interaction, client) {
        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('❌ System core offline - Command unavailable')
                .setColor('#FF0000');
            return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
        }

        interaction.shivaValidated = true;
        interaction.securityToken = COMMAND_SECURITY_TOKEN;

        await interaction.deferReply();

        const ConditionChecker = require('../../utils/checks');
        const checker = new ConditionChecker(client);

        try {
            const conditions = await checker.checkMusicConditions(
                interaction.guild.id,
                interaction.user.id,
                interaction.member.voice?.channelId
            );

            const canUse = await checker.canUseMusic(
                interaction.guild.id,
                interaction.user.id
            );

            if (!canUse) {
                const embed = new EmbedBuilder()
                    .setDescription('❌ You need DJ permissions to change autoplay settings!');

                return interaction.editReply({ embeds: [embed] })
                    .then(() =>
                        setTimeout(() => interaction.deleteReply().catch(() => {}), 3000)
                    );
            }

            const enabled = interaction.options.getBoolean('enabled');

            // Save setting to database
            await Server.findByIdAndUpdate(
                interaction.guild.id,
                {
                    'settings.autoplay': enabled
                },
                {
                    upsert: true,
                    new: true
                }
            );

            // Update current player immediately
            if (conditions.hasActivePlayer && conditions.player) {
                const player = conditions.player;

                player.isAutoplay = enabled;

                console.log(
                    `🎵 Autoplay runtime updated: ${enabled ? 'ON' : 'OFF'}`
                );
            }

            const embed = new EmbedBuilder()
                .setColor(enabled ? '#57F287' : '#ED4245')
                .setDescription(
                    `🎲 Autoplay has been **${enabled ? 'Enabled' : 'Disabled'}**`
                );

            return interaction.editReply({ embeds: [embed] })
                .then(() =>
                    setTimeout(() => interaction.deleteReply().catch(() => {}), 3000)
                );

        } catch (error) {
            console.error('Autoplay command error:', error);

            const embed = new EmbedBuilder()
                .setDescription('❌ An error occurred while toggling autoplay!');

            return interaction.editReply({ embeds: [embed] })
                .then(() =>
                    setTimeout(() => interaction.deleteReply().catch(() => {}), 3000)
                );
        }
    }
};