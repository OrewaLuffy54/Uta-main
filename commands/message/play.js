const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');
const { getYouTubeLinksFromSpotify } = require('../../utils/spotifyHandler');

module.exports = {
    name: 'play',
    aliases: ['p', 'song'],
    
    async execute(message, args, client) {

        const query = args.join(' ');
        if (!query) return message.reply("❌ Provide a song");

        const PlayerHandler = require('../../utils/player');

        try {

            const playerHandler = new PlayerHandler(client);

            let player = await playerHandler.createPlayer(
                message.guild.id,
                message.member.voice.channelId,
                message.channel.id
            );

            // 🔥 FIX: FORCE CONNECTION
            if (!player.connected) {
                client.riffy.createConnection({
                    guildId: message.guild.id,
                    voiceChannelId: message.member.voice.channelId,
                    textChannelId: message.channel.id,
                    deaf: true
                });

                player = client.riffy.players.get(message.guild.id);
            }

            // Spotify handling
            if (query.includes('spotify.com')) {
                const ytUrls = await getYouTubeLinksFromSpotify(query);

                for (const ytUrl of ytUrls) {
                    await playerHandler.playSong(player, ytUrl, message.author);
                }

                return message.reply(`🎶 Added ${ytUrls.length} track(s) from Spotify!`);
            }

            const result = await playerHandler.playSong(player, query, message.author);

            if (result.type === 'track') {
                return message.reply(`✅ Added: **${result.track.info.title}**`);
            }

            if (result.type === 'playlist') {
                return message.reply(`🎵 Added **${result.tracks}** songs`);
            }

            return message.reply('❌ No results found');

        } catch (err) {
            console.error(err);
            return message.reply('❌ Error playing song');
        }
    }
};
