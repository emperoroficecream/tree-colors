const utils = require('utils');

function getLuminance(node, isAdditive) {
  const slope = isAdditive ? 10 : -10;
  const base = isAdditive ? 70 : 40;
  const depth = node.depth;
  return (depth - 1) * slope + base;
}

function getChroma(node, isAdditive) {
  const slope = isAdditive ? -5 : 5;
  const base = isAdditive ? 75 : 60;
  const depth = node.depth;
  return (depth - 1) * slope + base;
}

function getHue(node, range, fraction) {
  const nodeColor = utils.getMiddleVal(range);
  fraction = fraction || 0.75;
  node.style = [];
  node.style.push(nodeColor);
  const n = node.nodes ? node.nodes.length : 0;
  // TODO: add permutation
  if (n > 0) {
    const partitionedRanges = utils.partition(range, n);
    node.nodes.forEach(function(child, i) {
      getHue(child, utils.getMidFraction(partitionedRanges[i], fraction), fraction);
    })
  }
}

return {
  getHCL(node, range, fraction, isAdditive) {
    return {
      h: getHue(node, range, fraction),
      c: getChroma(node, isAdditive),
      l: getLuminance(node, isAdditive)
    }
  }
}