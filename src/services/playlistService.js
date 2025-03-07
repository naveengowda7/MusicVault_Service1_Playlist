const axios = require("axios");
const NodeCache = require("node-cache");
const extractPlaylistDetails = require("../utils/extractPlaylistDetails");

const SPOTIFY_API_URL = "https://api.spotify.com/v1";
const cache = new NodeCache({ stdTTL: 60 * 5 });

const fetchAllTracks = async (playlistId, accessToken) => {
  let tracks = [];
  let nextUrl = `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks?limit=100`;

  try {
    while (nextUrl) {
      const { data } = await axios.get(nextUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      tracks.push(...data.items);
      nextUrl = data.next;
    }
  } catch (error) {
    console.error("Error fetching playlist tracks:", error.message);
    throw error;
  }

  return tracks;
};

const getPlaylist = async (req, res) => {
  const accessToken = req.cookies.access_token;
  const playlistId = req.params.playlistId;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is required" });
  }

  if (!playlistId) {
    return res.status(400).json({ error: "Playlist ID is required" });
  }

  const cachedPlaylist = cache.get(playlistId);
  if (cachedPlaylist) {
    return res.status(200).json(cachedPlaylist);
  }

  try {
    const [playlistResponse, tracks] = await Promise.all([
      axios.get(`${SPOTIFY_API_URL}/playlists/${playlistId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
      fetchAllTracks(playlistId, accessToken),
    ]);

    let playlistData = playlistResponse.data;
    playlistData.tracks.items = tracks;

    const filteredPlaylist = extractPlaylistDetails(playlistData);

    cache.set(playlistId, filteredPlaylist);

    res.status(200).json(filteredPlaylist);
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

const getCurrentUsersPlaylist = async (req, res) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is required" });
  }

  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching playlists:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

module.exports = { getCurrentUsersPlaylist, getPlaylist };
