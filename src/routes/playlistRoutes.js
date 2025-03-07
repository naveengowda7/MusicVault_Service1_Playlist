const express = require("express");
const { getCurrentUsersPlaylist, getPlaylist } = require("../services/playlistService");


const router = express.Router();

router.get("/my", getCurrentUsersPlaylist);
router.get("/:playlistId", getPlaylist);

module.exports = router;
