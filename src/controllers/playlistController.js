const playlistServie = require("../services/playlistService")

const getPlaylist = async (req, res) => {
  const accessToken = req.cookies.access_token;
  const playlistId = req.params.playlistId;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token is required" });
  }

  if (!playlistId) {
    return res.status(400).json({ error: "Playlist ID is required" });
  }

  try {
    const playlistData = await playlistService.fetchPlaylist(playlistId, accessToken);
    res.status(200).json(playlistData);
  } catch (error) {
    console.error("Error fetching playlist:", error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

module.exports = { getPlaylist };
