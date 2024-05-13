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

function loadData({ numPlayers, results }) {
  results = results
    .trim()
    .split(' ')
    .map((value) => parseInt(value));
  if (isNaN(numPlayers))
    return handleInvalid(messageGenerator.notANumber(numPlayers));
  if (!validator.allInRange([numPlayers], 6, 100))
    return handleInvalid(messageGenerator.outOfRange(6, 100, numPlayers));
  if (!validator.allIntegers(results))
    return handleInvalid(messageGenerator.allowOnlyIntegers());
  if (!validator.allInRange(results, 1, numPlayers))
    return handleInvalid(messageGenerator.outOfRange(1, numPlayers, results));
  if (validator.hasDuplicate(results))
    return handleInvalid(messageGenerator.noDuplicates());
  dataRef.current.numPlayers = numPlayers;
  dataRef.current.imposterPositions = results;
  return { answer: ANSWER.OK };
}

module.exports = [dataRef, loadData];
