function setupLineDrawing() {
  var start = {};
  var end = {};
  var lastLine;

  canvas.on('mouse:down', function(options) {
    start.x = options.e.clientX;
    start.y = options.e.clientY;
  });

  canvas.on('mouse:move', options => {
    if (!start.x) {
      removeLine(lastLine);
      return;
    };
    end.x = options.e.clientX;
    end.y = options.e.clientY;

    removeLine(lastLine);
    lastLine = drawLine(start, end);
  });

  canvas.on('mouse:up', function(options) {
    end.x = options.e.clientX;
    end.y = options.e.clientY;

    removeLine(lastLine);

    var length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    if (length < 20) {
      start = {};
      end = {};
      return;
    }

    var score = createScore([], start, end);
    drawScore(score);

    lastLine = null;
    start = {};
    end = {};
  });
}

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