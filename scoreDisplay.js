function setupScoreboard() {
  new Vue({
    el: "#scores",
    data: {
      scores,
      players
    },
    computed: {
      compiledMarkdown: function() {
        return marked(this.input, { sanitize: true });
      }
    },
    methods: {
      addToScore: player => {
        var score = scores[scores.length-1];
        if (score.from == UNKNOWN_PLAYER) {
          score.from = player;
        } else if (score.to == UNKNOWN_PLAYER)
        {
          score.to = player;
        }
      }
    }
  });
}