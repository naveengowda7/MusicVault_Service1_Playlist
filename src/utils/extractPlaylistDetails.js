const extractPlaylistDetails = (playlistData) => {
  return {
    id: playlistData.id,
    images: playlistData.images,
    name: playlistData.name,
    owner: playlistData.owner,
    tracks: {
      items: playlistData.tracks.items.map(item => ({
        href: item.track.href,
        id: item.track.id,
        images: item.track.album.images,
        name: item.track.name,
      }))
    },
  };
};

module.exports = extractPlaylistDetails;
