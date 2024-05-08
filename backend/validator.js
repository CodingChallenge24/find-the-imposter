function hasDuplicate(arr) {
  return new Set(arr).size !== arr.length;
}

function allInRange(arr, l, r) {
  return arr.every((value) => l <= value && value <= r);
}

function allIntegers(arr) {
  return arr.every((value) => Number.isInteger(value));
}

function expectedNumber(expected, got) {
  return expected === got;
}

module.exports = { hasDuplicate, allInRange, allIntegers, expectedNumber };
