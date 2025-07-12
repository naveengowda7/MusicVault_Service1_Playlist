const axios = require('axios');
const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const login = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
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

    req.session.user = {
      id: spotifyUser.id,
      accessToken: accessToken,
      refreshToken: refreshToken
    };

    res.redirect('https://musicvault-frontend.onrender.com/callback');

  } catch (error) {
    res.status(500).json({
      error: "Failed to authenticate",
    })
  }
}

app.get('/api/test-auth', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: "Strict",
  })
  res.send("Logged out successfully");
}

module.exports = { login, callback, logout }