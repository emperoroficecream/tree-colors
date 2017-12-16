function getMin(a, b) {
  return a < b ? a : b;
}

function getMax(a, b) {
  return a > b ? a : b;
}

const PRECISION = 0.1;

module.exports = {
  isDefined(arg) {
    return typeof arg !== 'undefined';
  },
  getMidVal(range) {
    const min = range[0];
    const max = range[1];
    if (min > max) throw new Error('min before max');
    return min + (max - min) / 2; 
  },
  partition(range, n) {
    const min = range[0];
    const max = range[1];
    const size = (max - min) / n;
    return Array(n).fill('').reduce(function(acc, i, ix) {
      const prev = acc[ix - 1];
      const start = (prev && prev[1] + PRECISION) || min;
      const end = getMin(start + size, max);
      acc.push([start, end]);
      return acc;
    }, []); 
  },
  getMidFraction(range, fraction) {
    const mid = this.getMidVal(range);
    const half = (range[1] - range[0]) * fraction / 2;
    return [(mid - half + 0.5 * PRECISION), (mid + half - 0.5 * PRECISION)];
  }
}