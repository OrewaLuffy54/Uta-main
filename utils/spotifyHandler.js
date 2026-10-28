const SpotifyWebApi = require('spotify-web-api-node');
const yts = require('yt-search');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getYouTubeLinksFromSpotify(url) {
  try {
    // Get Spotify access token
    const tokenData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(tokenData.body['access_token']);

    // Track
    if (url.includes('/track/')) {
      const trackId = url.split('/track/')[1].split('?')[0];
      const trackData = await spotifyApi.getTrack(trackId);
      const query = `${trackData.body.name} ${trackData.body.artists[0].name}`;
      const yt = await yts(query);
      return [yt.videos[0]?.url];
    }

    // Playlist
    if (url.includes('/playlist/')) {
      const playlistId = url.split('/playlist/')[1].split('?')[0];
      const playlist = await spotifyApi.getPlaylistTracks(playlistId);
      const results = [];

      for (const item of playlist.body.items) {
        const query = `${item.track.name} ${item.track.artists[0].name}`;
        const yt = await yts(query);
        if (yt.videos[0]) results.push(yt.videos[0].url);
      }

      return results;
    }

    // Album
    if (url.includes('/album/')) {
      const albumId = url.split('/album/')[1].split('?')[0];
      const album = await spotifyApi.getAlbumTracks(albumId);
      const results = [];

      for (const item of album.body.items) {
        const query = `${item.name} ${item.artists[0].name}`;
        const yt = await yts(query);
        if (yt.videos[0]) results.push(yt.videos[0].url);
      }

      return results;
    }

    return [];
  } catch (err) {
    console.error('Spotify handler error:', err);
    return [];
  }
}

module.exports = { getYouTubeLinksFromSpotify };
