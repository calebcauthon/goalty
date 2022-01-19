function setupScoreboard() {
  var data = {
    scores: scoreController.getScores(),
    players: playerController.getPlayers(),
    isEditingScoreFrom: false,
    isEditingScoreTo: false,
    editingScoreFrom: null,
    editingScoreTo: null,
    isDeletingScore: false,
    scoreToDelete: null
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
      cancelEditing: score => {
        if (data.isEditingScoreFrom && data.editingScoreFrom == score) {
          data.editingScoreFrom = null;
          data.isEditingScoreFrom = false;
        }

        if (data.isEditingScoreTo && data.editingScoreTo == score) {
          data.editingScoreTo = null;
          data.isEditingScoreTo = false;
        }

        if (data.isDeletingScore && data.scoreToDelete == score) {
          data.scoreToDelete = null;
          data.isDeletingScore = false;
        }
      },
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
      },
      preDeleteScore: score => {
        data.isDeletingScore = true;
        data.scoreToDelete = score;
      },
      isBeingDeleted: score => {
        return data.isDeletingScore && data.scoreToDelete == score;
      },
      deleteScore: score => {
        scoreController.removeScore(score);
        data.isDeletingScore = false;
        data.scoreToDelete = null;
      }
    }
  });
}