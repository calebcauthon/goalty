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

    lastLine = drawLine(start, end);

    createScore(lastLine, start, end);

    start = {};
    end = {};
  });

  function createScore(line, start, end) {
    scoreController.addScore({
      timestamp: Date.now()
    });
  }
}
