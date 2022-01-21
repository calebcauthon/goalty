var UNKNOWN_PLAYER = { name: '?' };
var players = [];

var Score = (data) => {
  var methods = {
    needsFrom: () => self.from == UNKNOWN_PLAYER,
    needsTo: () => self.to == UNKNOWN_PLAYER,
    setSequence: sequence => self.sequence = sequence
  };

  var self = {
    isTurnover: false,
    sequence: 0,
    line: data.line,
    lineCoordinates: data.lineCoordinates || { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    from: data.from || UNKNOWN_PLAYER,
    to: data.to || UNKNOWN_PLAYER,
    ...methods
  };

  return self;
};

var statsController = {
  getTotals: (scores) => {
    return scoreController.getPlayers().map(player => {
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

var scoreController = {
  setPlayers: (players) => {
    this.players = players;
  },
  getPlayers: () => {
    return this.players;
  },
  setScores: (scores) => {
    this.scores = scores;
  },
  getScores: () => this.scores,
  resetSequenceNumbers: () => {
    var index = 1;
    this.scores.forEach(score => {
      score.setSequence(index);
      index++;
    });
  },
  removeScore: score => {
    var index = this.scores.indexOf(score);
    this.scores.splice(index, 1);
    removeLine(score.line);
    scoreController.resetSequenceNumbers(this.scores);

    data.totals = statsController.getTotals(scoreController.getScores());
  },
  addScore: data => {
    var score = Score(data);
    this.scores.push(score);
    score.setSequence(this.scores.length);
    data.totals = statsController.getTotals(scoreController.getScores());

    return score;
  },
  getMostRecentScore: () => {
    var recentScore = this.scores[this.scores.length - 1];
    return recentScore;
  },
  setFrom: (score, player) => {
    score.from = player;
    data.totals = statsController.getTotals(scoreController.getScores());
  },
  setTo: (score, player) => {
    score.to = player;
    data.totals = statsController.getTotals(scoreController.getScores());
  },
  setTurnoverStatus: (score, status) => {
    score.isTurnover = status;
    data.totals = statsController.getTotals(scoreController.getScores());
  }
};

var playerController = {
  getPlayers: () => players
};