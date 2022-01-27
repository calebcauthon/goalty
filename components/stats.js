Vue.component('stats', {
  props: ['totals'],
  data: function () {
    return {
      column: 'assists'
    };
  },
  computed: {
    sortedTotals() {
      return this.totals.sort((a,b) => {
        if (a[this.column] < b[this.column]) {
          return 1;
        }
        if (a[this.column] > b[this.column]) {
          return -1;
        }
        return 0;
      });
    }
  },
  methods: {
  },
  template: `
    <div id="stat-list">
      <h3>Stats</h3>
      <table>
        <tr>
          <td>Name</td>
          <td class="clickable" v-on:click="column = 'assists'">Assists</td>
          <td class="clickable" v-on:click="column = 'goals'">Goals</td>
          <td class="clickable" v-on:click="column = 'turnovers'">Turnovers</td>
        </tr>
        <tr v-for="row in sortedTotals">
          <td>{{ row.player.name }}</td>
          <td>{{ row.assists }}</td>
          <td>{{ row.goals }}</td>
          <td>{{ row.turnovers }}</td>
        </tr>
      </table>
    </div>
  `
});