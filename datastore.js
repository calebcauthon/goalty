function getPlayers() {
  return fetch('/.netlify/functions/getPlayers')
  .then(response => {
    return response.json();
  });
}

function savePlayers(playerData) {
  return fetch('/.netlify/functions/savePlayers', {
    method: 'POST',
    body: JSON.stringify({
      "players": playerData
    })
  });
}