function setupScoreboard() {
  var data = {
    scores: scoreController.getScores(),
    players: playerController.getPlayers(),
    isEditingScoreFrom: false,
    editingScoreFrom: null,
    editingScoreTo: null
  };

  new Vue({
    el: "#scores",
    data,
    computed: {
      compiledMarkdown: function() {
        return marked(this.input, { sanitize: true });
      }
    },
    methods: {
      isBeingEditedFrom: score => {
        if (data.editingScoreFrom == score) {
          return true;
        }
      },
      isBeingEditedTo: score => {
        if (data.editingScoreTo == score) {
          return true;
        }
      },
      addToScore: player => {
        if (data.isEditingScoreFrom) {
          data.editingScoreFrom.from = player;
          data.isEditingScoreFrom = false;
          data.editingScoreFrom = null;
        } else if (data.isEditingScoreTo) {
          data.editingScoreTo.to = player;
          data.isEditingScoreTo = false;
          data.editingScoreTo = null;
        } else {
          var score = scoreController.getMostRecentScore();
          if (score.needsFrom()) {
            score.from = player;
          } else if (score.needsTo()) {
            score.to = player;
          }
        }
      },
      beginEditingScoreFrom: score => {
        data.isEditingScoreFrom = true;
        data.editingScoreFrom = score;        
      },
      beginEditingScoreTo: score => {
        data.isEditingScoreTo = true;
        data.editingScoreTo = score;        
      }
    }
  });
}