Vue.component('game', {
  props: ['gameData'],
  watch: {
    'gameData': 'newGame'
  },
  data: function () {
    return {
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
        .then(result => {
          scoreController.setScores(result);
          this.scores = scoreController.getScores();
          this.totals = statsController.getTotals(scoreController.getScores(), this.players);

          this.scores.forEach(score => drawScore(score));
          this.loaded = true;
          this.$forceUpdate();
        });
    },
    addToScore(player) {
      var scoreHighlighted = null;
      if (this.isEditingScoreFrom) {
        scoreHighlighted = this.editingScoreFrom
        scoreController.setFrom(scoreHighlighted, player);
        this.isEditingScoreFrom = false;
        this.editingScoreFrom = null;
      } else if (this.isEditingScoreTo) {
        scoreHighlighted = this.editingScoreTo;
        scoreController.setTo(scoreHighlighted, player);
        this.editingScoreTo.to = player;
        this.isEditingScoreTo = false;
        this.editingScoreTo = null;
      } else {
        var score = scoreController.getMostRecentScore();
        scoreHighlighted = score;
        if (score.needsFrom()) {
          scoreController.setFrom(score, player);
        } else if (score.needsTo()) {
          scoreController.setTo(score, player);
        }
      }

      if (
        this.editingScoreFrom != scoreHighlighted &&
        this.editingScoreTo != scoreHighlighted &&
        this.scoreToDelete != scoreHighlighted &&
        this.scoreHighlighted != scoreHighlighted
      ) {
        resetLineColor(scoreHighlighted);
      }

      this.save();
    }
  },
  template: `
<div id="game">
  <div id="canvas-container">
    <canvas id="c" width=800 height=1000></canvas>
  </div>
  <scores v-if="loaded" v-bind:scores="scores" v-bind:players="players"></scores>
  <stats
    v-if="loaded"
    v-bind:totals="totals"></stats>
</div>
`
});
