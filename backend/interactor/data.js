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
  imposters = parseInt(imposters);
  results = results
    .trim()
    .split(' ')
    .map((value) => parseInt(value));
  if (isNaN(imposters))
    return handleInvalid(messageGenerator.notANumber(imposters));
  if (!validator.allInRange([imposters], 1, 100))
    return handleInvalid(messageGenerator.outOfRange(1, 100, imposters));
  if (!validator.isAMultipleOf(imposters, 3))
    return handleInvalid(messageGenerator.notAMultipleOf(imposters));
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
