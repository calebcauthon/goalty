function getPlayers() {
  fetch('/.netlify/functions/hello')
  .then(response => {
    return response.json();
  }).then(({ players }) => {
    return players;
  });
}