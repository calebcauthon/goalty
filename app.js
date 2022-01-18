var scores = [
  { from: { name: 'caleb' }, to: { name: 'taylor' } }
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
    from: data.from || UNKNOWN_PLAYER,
    to: data.to || UNKNOWN_PLAYER,
    ...methods
  };

  return self;
};

var scoreController = {
  getScores: () => scores,
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