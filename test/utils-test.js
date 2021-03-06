import test from 'ava';
import u from '../src/utils'

test('exists', t => {
   t.truthy(u);
});

test('has a function `getMidVal`', t => {
  t.is('function', typeof u.getMidVal);
});

test('`getMidVal` returns the middle value of a range: case 1', t => {
  const range = [0, 2];
  t.is(1, u.getMidVal(range));
});

test('`getMidVal` returns the middle value of a range: case 2', t => {
  const range = [5, 9];
  t.is(7, u.getMidVal(range));
});

test('`getMidVal` returns the middle value of a range: case 3', t => {
  const range = [1, 2];
  t.is(1.5, u.getMidVal(range));
});

test('`getMidVal` throws an error when passed in a range of `[max, min]`', t => {
  const range = [2, 1];
  const error = t.throws(() => {
    u.getMidVal(range);
  }, Error);
  t.is(error.message, 'min before max');
});

test('has a function `partition`', t => {
  t.is('function', typeof u.partition);
});

test('`partition` partitions a range into n parts of almost equal size: case 1', t => {
  t.deepEqual([[0, 2], [2.1, 4]], u.partition([0, 4], 2));
});

test('`partition` partitions a range into n parts of almost equal size: case 2', t => {
  t.deepEqual([[0, 3], [3.1, 6]], u.partition([0, 6], 2));
});

test('`partition` partitions a range into n parts of almost equal size: case 3', t => {
  t.deepEqual([[0, 2.5], [2.6, 5]], u.partition([0, 5], 2));
});

test('has a function `getMidFraction`', t => {
  t.is('function', typeof u.getMidFraction);
});

test('`getMidFraction` returns a middle range of given fraction from the original range: case 1', t => {
  t.deepEqual([4.05, 5.95], u.getMidFraction([0, 10], 0.2));
});

test('`getMidFraction` returns a middle range of given fraction from the original range: case 2', t => {
  t.deepEqual([3.55, 6.45], u.getMidFraction([0, 10], 0.3));
});