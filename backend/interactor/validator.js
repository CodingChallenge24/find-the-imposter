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

function hasMoreThan(arrTarget, arrRef) {
  return (
    arrTarget.length > arrRef.length &&
    arrRef.every((value) => arrTarget.includes(value))
  );
}

function isAMultipleOf(value, k) {
  return value % k === 0;
}

module.exports = {
  hasDuplicate,
  allInRange,
  allIntegers,
  expectedNumber,
  hasMoreThan,
  isAMultipleOf,
};
