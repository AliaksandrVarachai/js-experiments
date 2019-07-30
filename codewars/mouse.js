function isIntersection(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  var aMin, aMax, bMin, bMax;
  if (ax1 === ax2) { // a - vert
    if (bx1 === bx2) { // b - vert
      if (ax1 === bx1) {
        if (ay1 < ay2) {
          aMin = ay1;
          aMax = ay2;
        } else {
          aMin = ay2;
          aMax = ay1;
        }
        if (by1 < by2) {
          bMin = by1;
          bMax = by2;
        } else {
          bMin = by2;
          bMax = by1;
        }
        return !(aMax < bMin || aMin > bMax);
      }
      return false;
    } else { // b - horiz
      return (ax1 - bx1) * (ax1 - bx2) <= 0 && (by1 - ay1) * (by1 - ay2) <= 0
    }
  } else { // a - horiz
    if (bx1 === bx2) { // b - vert
      return (bx1 - ax1) * (bx1 - ax2) <= 0 && (ay1 - by1) * (ay1 - by2) <= 0
    } else { // b - horiz
      if (ay1 === by1) {
        if (ax1 < ax2) {
          aMin = ax1;
          aMax = ax2;
        } else {
          aMin = ax2;
          aMax = ax1;
        }
        if (bx1 < bx2) {
          bMin = bx1;
          bMax = bx2;
        } else {
          bMin = bx2;
          bMax = bx1;
        }
        return !(aMax < bMin || aMin > bMax);
      }
      return false;
    }
  }
}

function mousePath(s){
  var intervals = [], turns = [];
  s.match(/^\d+|R\d+|L\d+/g).forEach(match => {
    switch(match[0]) {
      case 'R':
        turns.push(1);
        intervals.push(parseInt(match.slice(1), 10));
        break;
      case 'L':
        turns.push(-1);
        intervals.push(parseInt(match.slice(1), 10));
        break;
      default:
        turns.push(1); // the initial direction does not matter
        intervals.push(parseInt(match, 10));
    }
  });
  var x = [intervals[0]], y = [0];
  var area = 0;
  for (var i = 1, len = turns.length; i < len; i++) {
    var interval = intervals[i];
    turns[i] += turns[i - 1];
    switch (turns[i] % 4) {
      case 1: case -3:
        x[i] = x[i - 1] + interval;
        y[i] = y[i - 1];
        area += interval * y[i];
        break;
      case 2: case -2:
        x[i] = x[i - 1];
        y[i] = y[i - 1] - interval;
        break;
      case 3: case -1:
        x[i] = x[i - 1] - interval;
        y[i] = y[i - 1];
        area -= interval * y[i];
        break;
      case 0: case -0:
        x[i] = x[i - 1];
        y[i] = y[i - 1] + interval;
        break;
    }
    if (i === len - 1 && turns[i] % 4 === 1)
      return null;
    if (1 < i && i < len - 1 && isIntersection(x[i - 1], y[i - 1], x[i], y[i], 0, 0, x[0], y[0]))
      return null;
    for (var j = 1, prevLen = i - 1; j < prevLen; j++) {
      if (isIntersection(x[i - 1], y[i - 1], x[i], y[i], x[j - 1], y[j - 1], x[j], y[j]))
        return null;
    }
  }

  return x[x.length - 1] || y[y.length - 1] ? null : Math.abs(area);
}

console.log(mousePath('2R4R4R4R2')); //100