Vue.component('scores', {
  props: ['players', 'scores'],
  emits: ['edit'],
  data: function () {
    return {
      isEditingPlayers: false,
      isEditingScoreFrom: false,
      isEditingScoreTo: false,
      editingScoreFrom: null,
      editingScoreTo: null,
      isDeletingScore: false,
      scoreToDelete: null,
      scoreHighlighted: null,
      preHighlightedScore: null
    };
  },
  computed: {
    orderedPlayers() {
      return this.players.map(x => x).sort((p1, p2) => {
        if (p1.name < p2.name) {
          return -1;
        } else if (p2.name > p1.name) {
          return 1;
        } else {
          return 0;
        }
      })
    },
  },
  methods: {
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
      this.$emit('edit');
    },
    convertScoreToScore() {
      var score = this.editingScoreFrom || this.editingScoreTo || scoreController.getMostRecentScore();
      scoreController.setTurnoverStatus(score, false);
      resetLineColor(score);
      this.$emit('edit');
    },
    beginEditingPlayers() {
      this.isEditingPlayers = true;
    },
    stopEditingPlayers() {
      this.isEditingPlayers = false;
    },
    removePlayer(player) {
      var index = this.players.indexOf(player);
      this.players.splice(index, 1);
    },
    addNewPlayer() {
      this.players.push({ name: 'New Player '});
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
  },
  template: `
  <div id="scores-container">
    <div id="player-list">
      <h3>Players</h3>
      <span v-if="!isEditingPlayers" v-on:click="beginEditingPlayers()" class="clickable">edit players</span>
      <div v-if="isEditingPlayers">
        <span v-on:click="stopEditingPlayers()" class="clickable">done editing</span>
        | <span v-on:click="addNewPlayer()" class="clickable">add player</span>
      </div>
      <table>
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
      <span class="clickable" v-on:click="hideAllArrows()">hide all</span> |
      <span class="clickable" v-on:click="showAllArrows()">show all</span>
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

          <td v-if="!score.isTurnover" v-on:click="convertScoreToTurnover()">{{ score.sequence }}</td>
          <td v-if="score.isTurnover" v-on:click="convertScoreToScore()">{{ score.sequence }}</td>

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
  </div>
  `
});