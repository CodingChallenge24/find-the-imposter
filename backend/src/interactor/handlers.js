const { QUERY_TYPE, ANSWER } = require('./constants');
const { numPlayers, imposterPositions } = require('./data');
const messageGenerator = require('./messages');
const validator = require('./validator');

function getResult(query) {
  const [type, ...data] = query.split(' ');
  return handleQueryType({ type, data });
}

function getNumImposters(positions) {
  return positions.filter((value) => imposterPositions.includes(value)).length;
}

function handleQueryType(req) {
  switch (req.type) {
    case QUERY_TYPE.QUESTION:
      return handleQuestion(req);
    case QUERY_TYPE.ANSWER:
      return handleAnswer(req);
    case QUERY_TYPE.SOLUTION:
      return handleSolution(req);
    default:
      return handleInvalid(messageGenerator.queryTypeNotSupported(req.type));
  }
}

function handleInvalid(message) {
  return {
    answer: ANSWER.INVALID,
    message,
  };
}

function handleQuestion(req) {
  if (!validator.expectedNumber(3, req.data.length))
    return handleInvalid(messageGenerator.expectedNumber(3, req.data.length));
  const positions = req.data.map((value) => parseInt(value));
  if (!validator.allIntegers(positions))
    return handleInvalid(messageGenerator.allowOnlyIntegers());
  if (!validator.allInRange(positions, 1, numPlayers))
    return handleInvalid(
      messageGenerator.outOfRange(1, numPlayers, positions.join(', ')),
    );
  if (validator.hasDuplicate(positions))
    return handleInvalid(messageGenerator.noDuplicates());
  return {
    answer: getNumImposters(positions) > 1 ? ANSWER.MORE : ANSWER.LESS,
  };
}

function handleAnswer(req) {
  const positions = req.data.map((value) => parseInt(value));
  if (!validator.allIntegers(positions))
    return handleInvalid(messageGenerator.allowOnlyIntegers());
  if (!validator.allInRange(positions, 1, numPlayers))
    return handleInvalid(
      messageGenerator.outOfRange(1, numPlayers, positions.join(', ')),
    );
  if (validator.hasDuplicate(positions))
    return handleInvalid(messageGenerator.noDuplicates());
  if (validator.hasMoreThan(positions, imposterPositions))
    return handleInvalid(
      messageGenerator.getMoreThanSolution(
        imposterPositions.length,
        positions.length,
      ),
    );
  const posMatch = positions.filter((value) =>
    imposterPositions.includes(value),
  );
  return {
    answer:
      posMatch.length === imposterPositions.length ? ANSWER.OK : ANSWER.PARTIAL,
    posMatch,
    accuracy: (posMatch.length / imposterPositions.length).toFixed(6),
  };
}

function handleSolution(req) {
  return {
    answer: ANSWER.OK,
    solution: { numPlayers, imposterPositions },
  };
}

module.exports = {
  getResult,
  getNumImposters,
  handleQuestion,
  handleAnswer,
  handleSolution,
  handleInvalid,
};
