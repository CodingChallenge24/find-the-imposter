function outOfRange(from, to, value) {
  return `Expected ${value} to be between ${from} and ${to}`;
}

function allowOnlyIntegers() {
  return "Only integers are allowed";
}

function noDuplicates() {
  return "Duplicate numbers are not allowed";
}

function expectedNumber(expected, got) {
  return `Expected ${expected}, but found ${got}`;
}

function queryTypeNotSupported(type) {
  return `Query type "${type}" is not supported`;
}

module.exports = {
  outOfRange,
  allowOnlyIntegers,
  noDuplicates,
  expectedNumber,
  queryTypeNotSupported,
};
