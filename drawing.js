var SCORE_COLOR = '#2ce131';

function drawArrow(fromx, fromy, tox, toy) {
  var angle = Math.atan2(toy - fromy, tox - fromx);
  var headlen = 15;  // arrow head size
  tox = tox - (headlen) * Math.cos(angle);
  toy = toy - (headlen) * Math.sin(angle);

  var points = [
      {
        x: fromx,  // start point
        y: fromy
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      },{
        x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
      },{
        x: tox + (headlen) * Math.cos(angle),  // tip
        y: toy + (headlen) * Math.sin(angle)
      }, {
        x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      },{
        x: fromx,
        y: fromy
      }
  ];
  var pline = new fabric.Polyline(points, {
      fill: SCORE_COLOR,
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
      selectable: false
  });
  return pline;
}

function drawField() {
  var ONE_YARD = 20; // pixels


  canvas.set('selection', false);
  canvas.set('hoverCursor', 'pointer');
  var ORIGIN = { left: 100, top: 10 };
  var FIELD_BOUNDARY_COLOR = 'black';
  var FIELD_BOUNDARY_WIDTH = 5;
  var FIELD_WIDTH = 30 * ONE_YARD; // not to scale
  var FIELD_LENGTH = 35 * ONE_YARD;
  var END_ZONE_LENGTH = 10 * ONE_YARD;
  var FIELD_SIZE = { width: FIELD_WIDTH, height: FIELD_LENGTH };
  var END_ZONE_SIZE = { width: FIELD_WIDTH, height: END_ZONE_LENGTH };

  var FIELD_LINE = { strokeWidth: FIELD_BOUNDARY_WIDTH, stroke: FIELD_BOUNDARY_COLOR };



  var fieldProper = new fabric.Rect({
    ...ORIGIN,
    ...FIELD_LINE,
    ...FIELD_SIZE,
    ...{
      fill: 'white',
      selectable: false,
    }
  });

  var clearZone = new fabric.Rect({
    ...{ left: ORIGIN.left, top: ORIGIN.top + FIELD_SIZE.height },
    ...FIELD_LINE,
    ...END_ZONE_SIZE,
    ...{
      fill: 'white',
      selectable: false
    }
  });

  var HOOP_WIDTH = 15 * ONE_YARD;
  var HOOP_LENGTH = 9 * ONE_YARD;
  var KEY_ORIGIN = {
    ...{ left: fieldProper.left + FIELD_WIDTH / 2 - (HOOP_WIDTH / 2) },
    ...{ top: fieldProper.top + FIELD_LENGTH - 32 * ONE_YARD},
  };
  var key = new fabric.Ellipse({
    ...KEY_ORIGIN,
    rx: HOOP_WIDTH / 2,
    ry: HOOP_LENGTH,
    fill: '',
    stroke: 'green',
    strokeWidth: 3,
    selectable: false,
  });

  var hoopHider = new fabric.Rect({
    ...{ left: KEY_ORIGIN.left - 5 },
    ...{ top: KEY_ORIGIN.top + HOOP_LENGTH },
    fill: 'white',
    width: HOOP_WIDTH + 10,
    height: HOOP_LENGTH + 10,
    selectable: false
  });

  var hoopLine = new fabric.Path(`M ${KEY_ORIGIN.left} ${KEY_ORIGIN.top + HOOP_LENGTH} L ${KEY_ORIGIN.left + HOOP_WIDTH} ${KEY_ORIGIN.top + HOOP_LENGTH} z`);
  hoopLine.set({
    fill: 'red',
    stroke: 'green',
    opacity: 0.5,
    selectable: false
  });

  canvas.add(fieldProper);
  canvas.add(clearZone);
  canvas.add(key);
  canvas.add(hoopHider);
  canvas.add(hoopLine);
}

function setLineColor(line, color) {
  line.forEach(segment => {
    segment.set('fill', color);
  });
  canvas.renderAll();
}

function resetlineColor(line) {
  line.forEach(segment => {
    segment.set('fill', SCORE_COLOR);
  });
}

function drawLine(start, end) {
  var line = new fabric.Path(`M ${start.x} ${start.y} L ${end.x} ${end.y} z`);
  line.set({
    fill: 'red',
    stroke: 'green',
    opacity: 0.5,
    selectable: false
  });
  var arrow = drawArrow(start.x, start.y, end.x, end.y);
  canvas.add(arrow);

  return [line, arrow];
}

function removeLine(removables) {
  if (!removables)
  {
    return;
  }
  removables.forEach(thisObject => {
    canvas.remove(thisObject);     
  });
}
