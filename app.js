var scores = [
];

var UNKNOWN_PLAYER = { name: '?' };
var players = [
  { name: 'caleb' },
  { name: 'taylor' }
];

var Score = (data) => {
  var methods = {
    needsFrom: () => self.from == UNKNOWN_PLAYER,
    needsTo: () => self.to == UNKNOWN_PLAYER
  };

  var self = {
    line: data.line,
    from: data.from || UNKNOWN_PLAYER,
    to: data.to || UNKNOWN_PLAYER,
    ...methods
  };

  return self;
};

var scoreController = {
  getScores: () => scores,
  removeScore: score => {
    var index = scores.indexOf(score);
    scores.splice(index, 1);
    removeLine(score.line);
  },
  addScore: data => {
    var score = Score(data);
    scores.push(score);
  },
  getMostRecentScore: () => {
    var recentScore = scores[scores.length - 1];
    return recentScore;
  },
  setFrom: (score, player) => {
    score.from = player;
  },
  setTo: (score, player) => {
    score.to = player;
  }
};

var playerController = {
  getPlayers: () => players
};