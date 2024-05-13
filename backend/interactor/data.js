const validator = require('./validator');
const messageGenerator = require('./messages');
const { ANSWER } = require('./constants');
const { handleInvalid } = require('./handlers');

const dataRef = {
  current: {
    numPlayers: 6,
    imposterPositions: [1, 2, 4],
  },
};

function loadData({ imposters, results }) {
  results = results
    .trim()
    .split(' ')
    .map((value) => parseInt(value));
  if (isNaN(imposters))
    return handleInvalid(messageGenerator.notANumber(imposters));
  if (!validator.allInRange([imposters], 6, 100))
    return handleInvalid(messageGenerator.outOfRange(6, 100, imposters));
  if (!validator.allIntegers(results))
    return handleInvalid(messageGenerator.allowOnlyIntegers());
  if (!validator.allInRange(results, 1, imposters))
    return handleInvalid(messageGenerator.outOfRange(1, imposters, results));
  if (validator.hasDuplicate(results))
    return handleInvalid(messageGenerator.noDuplicates());
  dataRef.current.numPlayers = imposters;
  dataRef.current.imposterPositions = results;
  return { answer: ANSWER.OK };
}

module.exports = [dataRef, loadData];
