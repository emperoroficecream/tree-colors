(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const treeColors = require('../src/tree-colors');
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
    color = d3.hcl(0, 0, 70);
    format = d3.format(",d");

var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingInner(1);

d3.json("data.json", function(error, data) {
  if (error) throw error;

  treeColors(data);
  console.log(data);

  var root = d3.hierarchy(data)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySize)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(root);
  var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("id", function(d) { return d.data.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) {
        top.console.log(d.data);
        var hcl = d.data.__tree_color;
        return d3.hcl(parseInt(hcl.h), hcl.c, hcl.l);
      });

  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });
});

function sumByCount(d) {
  return d.children ? 0 : 1;
}

function sumBySize(d) {
  return d.size;
}
},{"../src/tree-colors":2}],2:[function(require,module,exports){
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
},{"./utils":3}],3:[function(require,module,exports){
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
},{}]},{},[1]);
