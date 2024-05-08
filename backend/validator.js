function hasDuplicate(arr) {
  return new Set(arr).size !== arr.length;
}

function allInRange(arr, l, r) {
  return arr.every((value) => l <= value && value <= r);
}

function allIntegers(arr) {
  return arr.every((value) => Number.isInteger(value));
}

module.exports = { hasDuplicate, allInRange, allIntegers };
