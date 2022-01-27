Vue.component('stats', {
  props: ['totals'],
  data: function () {
    return {

    };
  },
  template: `
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
  `
});