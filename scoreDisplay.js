var data = {
  totals: [],
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
      convertScoreToTurnover: () => {
        var score = data.editingScoreFrom || data.editingScoreTo || scoreController.getMostRecentScore();
        scoreController.setTurnoverStatus(score, true);
        showLineAsTurnover(score.line);
      },
      convertScoreToScore: () => {
        var score = data.editingScoreFrom || data.editingScoreTo || scoreController.getMostRecentScore();
        scoreController.setTurnoverStatus(score, false);
        resetLineColor(score);
      },
      addToScore: player => {
        var scoreHighlighted = null;
        if (data.isEditingScoreFrom) {
          scoreHighlighted = data.editingScoreFrom
          scoreController.setFrom(scoreHighlighted, player);
          data.isEditingScoreFrom = false;
          data.editingScoreFrom = null;
        } else if (data.isEditingScoreTo) {
          scoreHighlighted = data.editingScoreTo;
          scoreController.setTo(scoreHighlighted, player);
          data.editingScoreTo.to = player;
          data.isEditingScoreTo = false;
          data.editingScoreTo = null;
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
          data.editingScoreFrom != scoreHighlighted &&
          data.editingScoreTo != scoreHighlighted &&
          data.scoreToDelete != scoreHighlighted &&
          data.scoreHighlighted != scoreHighlighted
        ) {
          resetLineColor(scoreHighlighted);
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
        scoreController.getScores().forEach(score => {
          removeLine(score.line);
          drawScore(score);
        })
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
          resetLineColor(score);
        }
      },
      hideAllArrows: () => {
        scoreController.getScores().forEach(score => {
          hide(score.line);
        })
      },
      showAllArrows: () => {
        scoreController.getScores().forEach(score => {
          show(score.line);
        })
      },
      sortStatsBy: (column) => {
        data.totals = data.totals.sort((a,b) => {
          if (a[column] < b[column]) {
            return 1;
          }
          if (a[column] > b[column]) {
            return -1;
          }
          return 0;
        });
      }
    }
  });
}