function setupScoreboard() {
  new Vue({
    el: "#scores",
    data: {
      scores: scoreController.getScores(),
      players: playerController.getPlayers()
    },
    computed: {
      compiledMarkdown: function() {
        return marked(this.input, { sanitize: true });
      }
    },
    methods: {
      addToScore: player => {
        var score = scoreController.getMostRecentScore();
        if (score.needsFrom()) {
          score.from = player;
        } else if (score.needsTo()) {
          score.to = player;
        }
      }
    }
  });
}