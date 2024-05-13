function outOfRange(from, to, value) {
  return `Expected ${value} to be between ${from} and ${to}`;
}

function allowOnlyIntegers() {
  return 'Only integers are allowed';
}

function noDuplicates() {
  return 'Duplicate numbers are not allowed';
}

function expectedNumber(expected, got) {
  return `Expected ${expected}, but found ${got}`;
}

function queryTypeNotSupported(type) {
  return `Query type "${type}" is not supported`;
}

function getMoreThanSolution(ans_k, out_k) {
  return `Solution has ${ans_k} imposter(s) but found ${out_k} imposter(s) in answer, which is more than expected.`;
}

function notANumber(value) {
  return `${value} is not a number`;
}

function notAnArray(value) {
  return `${value} is not an array`;
}

function notAMultipleOf(value, k) {
  return `${value} is not a multiple of ${k}`;
}

module.exports = {
  outOfRange,
  allowOnlyIntegers,
  noDuplicates,
  expectedNumber,
  queryTypeNotSupported,
  getMoreThanSolution,
  notANumber,
  notAnArray,
  notAMultipleOf,
};
