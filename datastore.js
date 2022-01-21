function getPlayers() {
  return fetch('/.netlify/functions/getPlayers')
  .then(response => {
    return response.json();
  }).then(({ players }) => {
    savePlayers().then(() => {
      console.log('saved!');
    });

    return players;
  });
}

function savePlayers() {
  return fetch('/.netlify/functions/savePlayers', {
    method: 'POST',
    body: JSON.stringify({
      "players": players.concat([{ name: 'thing1' }])
    })
  });
}