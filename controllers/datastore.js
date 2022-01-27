function getGist(filename) {
  return fetch(`/.netlify/functions/getGist?filename=${filename}`)
    .then(response => response.json())
}

function saveGist(filename, content) {
  return fetch(`/.netlify/functions/saveGist`, {
    method: 'POST',
    body: JSON.stringify({
      "filename": filename,
      "content": content
    })
  });
}

function getPlayers(gameId) {
  return getGist(`players-${gameId}.json`)
    .then(result => result.players);
}

function savePlayers(playerData, gameId) {
  return saveGist(`players-${gameId}.json`, {
    players: playerData,
    gameId: gameId
  });
}

function saveScores(gameId, scoreData) {
  return saveGist(`scores-${gameId}.json`, scoreData);
}

function getScores(gameId) {
  return getGist(`scores-${gameId}.json`)
}