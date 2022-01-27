Vue.component('game-loader', {
  emits: ['selectGame'],
  mounted() {
    getGist(`all-games.json`)
      .then(games => {
        this.games = games;
      })
  },
  data: function () {
    return {
      selectedGame: null,
      count: 0,
      games: []
    }
  },
  template: `
  <div id="choose-game-app">
    Choose game: 
    <select v-model="selectedGame">
      <option v-bind:value="game" v-for="game in games">{{ game.name }}</option>
    </select>
    <button v-on:click="$emit('choose', selectedGame)">Go</button>
  </div>`
});