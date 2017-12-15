function getMin(a, b) {
  return a < b ? a : b;
}

function getMax(a, b) {
  return a > b ? a : b;
}

function getMidValFloat(range) {
  const min = range[0];
  const max = range[1];
  if (min > max) throw new Error('min before max');
  return min + (max - min) / 2; 
}

module.exports = {
  getMidVal(range) {
    return parseInt(getMidValFloat(range));
  },
  partition(range, n) {
    const min = range[0];
    const max = range[1];
    const size = parseInt((max - min) / n);
    return Array(n).fill('').reduce(function(acc, i, ix) {
      const prev = acc[ix - 1];
      const start = (prev && prev[1] + 1) || min;
      const end = getMin(start + size, max);
      acc.push([start, end]);
      return acc;
    }, []); 
  },
  getMidFraction(range, fraction) {
    const mid = getMidValFloat(range);
    const half = (range[1] - range[0]) * fraction / 2;
    return [Math.round(mid - half + 0.5), Math.round(mid + half - 0.5)];
  }
}