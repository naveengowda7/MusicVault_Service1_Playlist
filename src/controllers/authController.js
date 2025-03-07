const axios = require('axios');
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const login = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI),
    scope: "playlist-read-private playlist-read-collaborative"
  });

  console.log(params);
  res.redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
}

const callback = async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
    )

    res.cookie("access_token", response.data.access_token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 1000,
    })
    res.cookie("refresh_token", response.data.refresh_token, {
      httpOnly: true,
      sameSite: "Strict",
    })

    res.redirect('http://localhost:5173/callback');

  } catch (error) {
    res.status(500).json({
      error: "Failed to authenticate",
    })
  }
}

const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: "Strict",
  })
  res.send("Logged out successfully");
}

module.exports = { login, callback, logout }