const utils = require('./utils');

const DEFAULT_FRACTION = 0.45;
const DEFAULT_IS_ADDITIVE = true;
const rootHCL = { h: 0, c: 0, l: 70 };

function getLuminance(depth, isAdditive) {
  const slope = isAdditive ? -10 : 10;
  const base = isAdditive ? 70 : 40;
  return (depth - 1) * slope + base;
}

function getChroma(depth, isAdditive) {
  const slope = isAdditive ? -5 : 5;
  const base = isAdditive ? 75 : 60;
  return (depth - 1) * slope + base;
}

function setHCL(node, range, depth, isAdditive, fraction) {
  const h = utils.getMidVal(range);
  const c = getChroma(depth, isAdditive);
  const l = getLuminance(depth, isAdditive);

  node.__tree_color = (depth === 0) ? rootHCL : { h, c, l };

  const n = node.children ? node.children.length : 0;
  // TODO: add permutation
  if (n > 0) {
    const partitionedRanges = utils.partition(range, n);
    node.children.forEach(function(child, i) {
      setHCL(child, utils.getMidFraction(partitionedRanges[i], fraction), fraction, ++depth, isAdditive, fraction);
    })
  }
}

function main(root, fraction, isAdditive) {
  const rootRange = [0, 360];
  fraction = utils.isDefined(fraction) ? fraction : DEFAULT_FRACTION;
  isAdditive = utils.isDefined(isAdditive) ? isAdditive : DEFAULT_IS_ADDITIVE;
  setHCL(root, rootRange, 0, fraction, isAdditive);
}

module.exports = main;