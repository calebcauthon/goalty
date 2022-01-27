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
    <div>test
      <game-loader @choose="selectGame($event)"></game-loader>
      <game v-bind:game-data="currentGame"></game>
    </div>`
  };
const NewGame = { template: '<div>bar</div>' };

const routes = [
  { path: '/choose', component: ChooseGame },
  { path: '/new', component: NewGame }
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router,
}).$mount('#app');