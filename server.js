const express = require("express");
const cookieParser = require('cookie-parser');
const cors = require('cors');
require("dotenv").config();
const playlistRoutes = require("./src/routes/playlistRoutes");
const authRoutes = require("./src/routes/authRoutes")

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://musicvault-frontend.onrender.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(cookieParser());
app.use(express.json());

app.use("/api/playlist", playlistRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Spotify Service running on http://localhost:${PORT}`);
});