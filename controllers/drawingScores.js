function drawScore(score) {
  var line = drawLine(score.lineCoordinates.start, score.lineCoordinates.end);
  var text = drawNumber(score.lineCoordinates.end, `${score.sequence}`);
  score.line = line;
  score.line.push(text);

  line.forEach(target => {
    target.on('mousedown', () => {
      data.scoreHighlighted = score;
      highlightLine(line);
    });
  });

  if (score.isTurnover) {
    showLineAsTurnover(line);
  }
}

function createScore(line, start, end) {
  var score = scoreController.addScore({
    timestamp: Date.now(),
    line,
    lineCoordinates: { start, end }
  });

  return score;
}

function showLineAsTurnover(line) {
  setLineColor(line, 'red');
}

function highlightLine(line) {
  scoreController.getScores().forEach(thisScore => {
    resetLineColor(thisScore);
  });
  setLineColor(line, 'greenyellow');
}

function resetLineColor(score) {
  if (score.isTurnover) {
    setLineColor(score.line, 'red');
  } else {
    setLineColor(score.line, SCORE_COLOR);
  }
}

function preHighlightLine(line) {
  setLineColor(line, 'rgb(39, 26, 155)');
}