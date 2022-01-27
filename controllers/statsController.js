var statsController = {
  getTotals: (scores, players) => {
    return players.map(player => {
      var assists = scores.filter(s => !s.isTurnover).filter(s => s.from.name == player.name).length;
      var goals = scores.filter(s => !s.isTurnover).filter(s => s.to.name == player.name).length;
      var turnovers = scores.filter(s => s.isTurnover).filter(s => s.to.name == player.name || s.from.name == player.name).length;

      return {
        player,
        goals,
        assists,
        turnovers
      };
    });
  }
}
