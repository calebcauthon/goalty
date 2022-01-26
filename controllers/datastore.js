function getPlayers(gameId) {
  return fetch(`/.netlify/functions/getPlayers?gameId=${gameId}`)
  .then(response => response.json())
  .then(result => result.players);
}

function savePlayers(playerData, gameId) {
  return fetch(`/.netlify/functions/savePlayers`, {
    method: 'POST',
    body: JSON.stringify({
      "players": { players: playerData },
      "gameId": gameId
    })
  });
}

function saveScores(gameId, scoreData) {
  return fetch('/.netlify/functions/saveScores', {
    method: 'POST',
    body: JSON.stringify({
      "gameId": gameId,
      "scores": scoreData
    })
  });
}

function getScores(gameId) {
  return fetch(`/.netlify/functions/getScores?gameId=${gameId}`)
  .then(response => response.json());
}