var scoreController = {
  setPlayers: (players) => {
    this.players = players;
  },
  getPlayers: () => {
    return this.players;
  },
  setScores: (scores) => {
    this.scores = scores.map(s => Score(s));
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
  },
  addScore: data => {
    var score = Score(data);
    this.scores.push(score);
    score.setSequence(this.scores.length);

    return score;
  },
  getMostRecentScore: () => {
    var recentScore = this.scores[this.scores.length - 1];
    return recentScore;
  },
  setFrom: (score, player) => {
    score.from = player;
  },
  setTo: (score, player) => {
    score.to = player;
  },
  setTurnoverStatus: (score, status) => {
    score.isTurnover = status;
  }
};