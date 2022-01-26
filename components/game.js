Vue.component('game', {
  props: ['gameData'],
  data: function () {
    return {
      gameData: null,
      count: 0,
    }
  },
  template: `
<div id="game">
  {{ gameData }}
  <div style="float: left;">
    <canvas id="c" width=800 height=1000></canvas>
  </div>
  <div>
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
