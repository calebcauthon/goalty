Vue.component('game', {
  props: ['gameData'],
  watch: {
    'gameData': 'newGame'
  },
  data: function () {
    return {
      hookFn: [],
      gameId: 'game-1',
      totals: [],
      scores: [],
      players: [],
      loaded: false
    }
  },
  methods: {
    newGame(gameData) {
      window.canvas = new fabric.Canvas('c');
      setupLineDrawing();
      drawField();
      this.load(gameData.gameId);
    },
    save() {
      savePlayers(this.players, this.gameId)
        .then(() => saveScores(this.gameId, scoreController.getScores()));
    },
    load(gameId) {
      this.gameId = gameId;
      return getPlayers(gameId)
        .then(result => {
          scoreController.setPlayers(result);
          this.players.push(...scoreController.getPlayers());
        })
        .then(() => getScores(gameId))
        .then(scores => {
          scoreController.setScores(scores);
          this.scores = scoreController.getScores();
          this.totals = statsController.getTotals(scoreController.getScores(), this.players);

          this.scores.forEach(score => drawScore(score));
          this.loaded = true;
          this.$forceUpdate();
        });
    },
    refreshTotals() {
      this.scores = scoreController.getScores();
      this.totals = statsController.getTotals(this.scores, this.players);
    },
    attachHookedToNextPlayerSelection(hookFn) {
      this.hookFn.push(hookFn);
    },
    onPlayerSelect(player) {
      if (this.hookFn.length > 0) {
        var hook = this.hookFn.shift();
        hook(player);
      }
    }
  },
  template: `
<div id="game">
  <div id="canvas-container">
    <canvas id="c" width=800 height=1000></canvas>
  </div>
  <scores
    @edit="refreshTotals()"
    @selectScoreBox="attachHookedToNextPlayerSelection($event.hook)"
    v-if="loaded"
    v-bind:scores="scores"
    v-bind:players="players"></scores>
  <stats
    @select="onPlayerSelect($event)"
    v-if="loaded"
    v-bind:totals="totals"></stats>
</div>
`
});
