function getPlayers() {
  return fetch('/.netlify/functions/getPlayers')
  .then(response => {
    return response.json();
  }).then(({ players }) => {
    return players;

    savePlayers().then(() => {
      console.log('saved!');
    })
  });
}


function savePlayers() {
  return fetch('/.netlify/functions/savePlayers', {
    method: 'POST',
    data: JSON.stringify(players.concat(['thing1']))
  })
}