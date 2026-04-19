const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');
const { getYouTubeLinksFromSpotify } = require('../../utils/spotifyHandler');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or add to queue')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name, URL, or search query')
                .setRequired(true)
        ),
    securityToken: COMMAND_SECURITY_TOKEN,

    async execute(interaction, client) {

        await interaction.deferReply();

        const PlayerHandler = require('../../utils/player');
        const ErrorHandler = require('../../utils/errorHandler');

        const query = interaction.options.getString('query');

        try {

            const playerHandler = new PlayerHandler(client);

            let player = await playerHandler.createPlayer(
                interaction.guild.id,
                interaction.member.voice.channelId,
                interaction.channel.id
            );

            // 🔥 FIX: FORCE CONNECTION
            if (!player.connected) {
                client.riffy.createConnection({
                    guildId: interaction.guild.id,
                    voiceChannelId: interaction.member.voice.channelId,
                    textChannelId: interaction.channel.id,
                    deaf: true
                });

                player = client.riffy.players.get(interaction.guild.id);
            }

            // Spotify
            if (query.includes('spotify.com')) {
                const ytUrls = await getYouTubeLinksFromSpotify(query);

                for (const ytUrl of ytUrls) {
                    await playerHandler.playSong(player, ytUrl, interaction.user);
                }

                return interaction.editReply(`🎶 Added ${ytUrls.length} track(s) from Spotify!`);
            }

            const result = await playerHandler.playSong(player, query, interaction.user);

            if (result.type === 'track') {
                return interaction.editReply(`✅ Added: **${result.track.info.title}**`);
            }

            if (result.type === 'playlist') {
                return interaction.editReply(`🎵 Added **${result.tracks}** songs`);
            }

            return interaction.editReply('❌ No results found');

        } catch (err) {
            console.error(err);
            return interaction.editReply('❌ Error playing song');
        }
    }
};
