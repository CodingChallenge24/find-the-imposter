function hasDuplicate(arr) {
  return new Set(arr).size !== arr.length;
}

module.exports = { hasDuplicate };
