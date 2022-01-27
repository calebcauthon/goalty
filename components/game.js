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
      isEditingPlayers: false,
      isEditingScoreFrom: false,
      isEditingScoreTo: false,
      editingScoreFrom: null,
      editingScoreTo: null,
      isDeletingScore: false,
      scoreToDelete: null,
      scoreHighlighted: null,
      preHighlightedScore: null
    }
  },
  methods: {
    newGame(gameData) {
      window.canvas = new fabric.Canvas('c');
      setupLineDrawing();
      drawField();
      this.load(gameData.gameId);
    },
    beginEditingPlayers() {
      this.isEditingPlayers = true;
    },
    stopEditingPlayers() {
      this.isEditingPlayers = false;
      this.save();
    },
    removePlayer(player) {
      var index = this.players.indexOf(player);
      this.players.splice(index, 1);
      this.save();
    },
    addNewPlayer() {
      this.players.push({ name: 'New Player '});
      this.save();
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
          this.$forceUpdate();
        });
    },
    cancelEditing: score => {
      if (this.isEditingScoreFrom && this.editingScoreFrom == score) {
        this.editingScoreFrom = null;
        this.isEditingScoreFrom = false;
      }

      if (this.isEditingScoreTo && this.editingScoreTo == score) {
        this.editingScoreTo = null;
        this.isEditingScoreTo = false;
      }

      if (this.isDeletingScore && this.scoreToDelete == score) {
        this.scoreToDelete = null;
        this.isDeletingScore = false;
      }

      if (this.scoreHighlighted == score) {
        this.scoreHighlighted = null;
      }
    },
    isBeingEditedFrom: score => {
      if (this.editingScoreFrom == score) {
        return true;
      }
    },
    isBeingEditedTo: score => {
      if (this.editingScoreTo == score) {
        return true;
      }
    },
    convertScoreToTurnover() {
      var score = this.editingScoreFrom || this.editingScoreTo || scoreController.getMostRecentScore();
      scoreController.setTurnoverStatus(score, true);
      showLineAsTurnover(score.line);
      this.save();
    },
    convertScoreToScore() {
      var score = this.editingScoreFrom || this.editingScoreTo || scoreController.getMostRecentScore();
      scoreController.setTurnoverStatus(score, false);
      resetLineColor(score);
      this.save();
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
    },
    beginEditingScoreFrom: score => {
      highlightLine(score.line);
      this.isEditingScoreFrom = true;
      this.editingScoreFrom = score;        
    },
    beginEditingScoreTo: score => {
      this.isEditingScoreTo = true;
      this.editingScoreTo = score;        
    },
    preDeleteScore: score => {
      this.isDeletingScore = true;
      this.scoreToDelete = score;
    },
    isBeingDeleted: score => {
      return this.isDeletingScore && this.scoreToDelete == score;
    },
    deleteScore(score) {
      scoreController.removeScore(score);
      scoreController.getScores().forEach(score => {
        removeLine(score.line);
        drawScore(score);
      })
      this.isDeletingScore = false;
      this.scoreToDelete = null;
      this.save();
    },
    preHighlightScore: score => {
      preHighlightLine(score.line);
      this.preHighlightedScore = score;
    },
    unPreHighlightScore: score => {
      if (this.preHighlightedScore == score) {
        this.preHighlightedScore = null;
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
      this.totals = this.totals.sort((a,b) => {
        if (a[column] < b[column]) {
          return 1;
        }
        if (a[column] > b[column]) {
          return -1;
        }
        return 0;
      });
    }
  },
  template: `
<div id="game">
  {{ gameData }}
  <div id="canvas-container">
    <canvas id="c" width=800 height=1000></canvas>
  </div>
  <div id="scores-container">
    <span class="clickable" v-on:click="hideAllArrows()">hide all</span> |
    <span class="clickable" v-on:click="showAllArrows()">show all</span>
    <div id="player-list">
      <h3>Players</h3>
      <span v-if="!isEditingPlayers" v-on:click="beginEditingPlayers()" class="clickable">edit players</span>
      <div v-if="isEditingPlayers">
        <span v-on:click="stopEditingPlayers()" class="clickable">done editing</span>
        | <span v-on:click="addNewPlayer()" class="clickable">add player</span>
      </div>
      <table>
        <tr class="turnover-button">
          <td v-on:click="convertScoreToTurnover()">TURNOVER</td>
        </tr>
        <tr class="score-button">
          <td v-on:click="convertScoreToScore()">SCORE</td>
        </tr>
        <tr v-if="isEditingPlayers" v-for="player in players" class="player">
          <td>
            <input v-model="player.name" />
            <button v-on:click="removePlayer(player)" type="button">remove</button>
          </td>
        </tr>
        <tr v-if="!isEditingPlayers" v-for="player in orderedPlayers" class="player">
          <td v-on:click="addToScore(player)">
            {{ player.name }}
          </td>
        </tr>
      </table>
    </div>
    <div id="score-list">
      <h3>Scores</h3>
      <table>
        <tr>
          <td>#</td>
          <td>From</td>
          <td>To</td>
          <td></td>
          <td></td>
        </tr>
        <tr
          class="score-row"
          v-on:mouseover="preHighlightScore(score)"
          v-on:mouseout="unPreHighlightScore(score)"
          v-bind:class="{
            highlight: scoreHighlighted == score,
            prehighlight: preHighlightedScore == score,
            score: !score.isTurnover,
            turnover: score.isTurnover
          }"
          v-for="(score, index) in scores">
          <td>{{ score.sequence }}</td>
          <td
            v-bind:class="{ isBeingEdited: isBeingEditedFrom(score) }"
            v-on:click="beginEditingScoreFrom(score)">{{ score.from.name }}</td>
          <td
            v-bind:class="{ isBeingEdited: isBeingEditedTo(score) }"
            v-on:click="beginEditingScoreTo(score)">{{ score.to.name }}</td>

          <td
            v-if="isBeingEditedFrom(score) || isBeingEditedTo(score) || isBeingDeleted(score)"
            class="clickable"
            v-on:click="cancelEditing(score)">cancel</td>
          <td
            v-if="isBeingEditedFrom(score) || isBeingEditedTo(score)"
            class="clickable"
            v-on:click="preDeleteScore(score)">delete</td>
          <td
            v-if="isBeingDeleted(score)"
            >are you sure?
            <span
              class="clickable"
              v-on:click="deleteScore(score)">yes</span>
          </td>
          <td
            v-if="!(isBeingEditedFrom(score) || isBeingEditedTo(score))"></td>
        </tr>
      </table>
    </div>
    <div id="stat-list">
      <h3>Stats</h3>
      <table>
        <tr>
          <td>Name</td>
          <td class="clickable" v-on:click="sortStatsBy('assists')">Assists</td>
          <td class="clickable" v-on:click="sortStatsBy('goals')">Goals</td>
          <td class="clickable" v-on:click="sortStatsBy('turnovers')">Turnovers</td>
        </tr>
        <tr v-for="row in totals">
          <td>{{ row.player.name }}</td>
          <td>{{ row.assists }}</td>
          <td>{{ row.goals }}</td>
          <td>{{ row.turnovers }}</td>
        </tr>
      </table>
    </div>
  </div>
</div>
`
});
