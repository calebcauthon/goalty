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
    needsTo: () => self.to == UNKNOWN_PLAYER,
    setSequence: sequence => self.sequence = sequence
  };

  var self = {
    sequence: 0,
    line: data.line,
    lineCoordinates: data.lineCoordinates || { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    from: data.from || UNKNOWN_PLAYER,
    to: data.to || UNKNOWN_PLAYER,
    ...methods
  };

  return self;
};

var scoreController = {
  getScores: () => scores,
  resetSequenceNumbers: () => {
    var index = 1;
    scores.forEach(score => {
      score.setSequence(index);
      index++;
    });
  },
  removeScore: score => {
    var index = scores.indexOf(score);
    scores.splice(index, 1);
    removeLine(score.line);
    scoreController.resetSequenceNumbers(scores);
  },
  addScore: data => {
    var score = Score(data);
    scores.push(score);
    score.setSequence(scores.length);

    return score;
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