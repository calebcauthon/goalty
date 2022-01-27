const ChooseGame = {
  data: function() {
    return {
      currentGame: null
    }
  },
  methods: {
    selectGame(game) {
      this.currentGame = game;
    }
  },
  template: `
    <div id="choose-game-container">
      <div id="header-area">
        <game-loader @choose="selectGame($event)"></game-loader>
      </div>
      <div id="content-area">
        <game v-bind:game-data="currentGame"></game>
      </div>
    </div>
    `
  };

const routes = [
  { path: '/home', component: ChooseGame },
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router,
}).$mount('#app');