var Score = (data) => {
  var methods = {
    needsFrom: () => self.from == UNKNOWN_PLAYER,
    needsTo: () => self.to == UNKNOWN_PLAYER,
    setSequence: sequence => self.sequence = sequence
  };

  var self = {
    isTurnover: data.isTurnover || false,
    sequence: data.sequence || 0,
    line: data.line,
    lineCoordinates: data.lineCoordinates || { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
    from: data.from || UNKNOWN_PLAYER,
    to: data.to || UNKNOWN_PLAYER,
    ...methods
  };

  return self;
};
