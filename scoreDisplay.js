var data = {
  scores: scoreController.getScores(),
  players: playerController.getPlayers(),
  isEditingScoreFrom: false,
  isEditingScoreTo: false,
  editingScoreFrom: null,
  editingScoreTo: null,
  isDeletingScore: false,
  scoreToDelete: null,
  scoreHighlighted: null,
  preHighlightedScore: null
};
function setupScoreboard() {
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

        if (data.scoreHighlighted == score) {
          data.scoreHighlighted = null;
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
        var scoreHighlighted = null;
        if (data.isEditingScoreFrom) {
          scoreHighlighted = data.editingScoreFrom
          data.editingScoreFrom.from = player;
          data.isEditingScoreFrom = false;
          data.editingScoreFrom = null;
        } else if (data.isEditingScoreTo) {
          scoreHighlighted = data.editingScoreTo;
          data.editingScoreTo.to = player;
          data.isEditingScoreTo = false;
          data.editingScoreTo = null;
        } else {
          var score = scoreController.getMostRecentScore();
          scoreHighlighted = score;
          if (score.needsFrom()) {
            score.from = player;
          } else if (score.needsTo()) {
            score.to = player;
          }
        }

        if (
          data.editingScoreFrom != scoreHighlighted &&
          data.editingScoreTo != scoreHighlighted &&
          data.scoreToDelete != scoreHighlighted &&
          data.scoreHighlighted != scoreHighlighted
        ) {
          resetlineColor(scoreHighlighted.line);
        }
      },
      beginEditingScoreFrom: score => {
        highlightLine(score.line);
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
      },
      preHighlightScore: score => {
        preHighlightLine(score.line);
        data.preHighlightedScore = score;
      },
      unPreHighlightScore: score => {
        if (data.preHighlightedScore == score) {
          data.preHighlightedScore = null;
          resetlineColor(score.line);
        }
      }
    }
  });
}