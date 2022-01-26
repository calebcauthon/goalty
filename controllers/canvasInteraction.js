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