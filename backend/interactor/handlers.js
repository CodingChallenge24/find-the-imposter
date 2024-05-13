const { QUERY_TYPE, ANSWER } = require('./constants');
const messageGenerator = require('./messages');
const validator = require('./validator');

function getResult(query, data) {
  const [type, ...args] = query.split(' ');
  return handleQueryType({ type, args }, data);
}

function getNumImposters(positions, imposterPositions) {
  return positions.filter((value) => imposterPositions.includes(value)).length;
}

function handleQueryType(req, data) {
  switch (req.type) {
    case QUERY_TYPE.QUESTION:
      return handleQuestion(req, data);
    case QUERY_TYPE.ANSWER:
      return handleAnswer(req, data);
    case QUERY_TYPE.SOLUTION:
      return handleSolution(req, data);
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

function handleQuestion(req, { numPlayers, imposterPositions }) {
  if (!validator.expectedNumber(3, req.args.length))
    return handleInvalid(messageGenerator.expectedNumber(3, req.args.length));
  const positions = req.args.map((value) => parseInt(value));
  if (!validator.allIntegers(positions))
    return handleInvalid(messageGenerator.allowOnlyIntegers());
  if (!validator.allInRange(positions, 1, numPlayers))
    return handleInvalid(
      messageGenerator.outOfRange(1, numPlayers, positions.join(', ')),
    );
  if (validator.hasDuplicate(positions))
    return handleInvalid(messageGenerator.noDuplicates());
  return {
    answer:
      getNumImposters(positions, imposterPositions) > 1
        ? ANSWER.MORE
        : ANSWER.LESS,
  };
}

function handleAnswer(req, { numPlayers, imposterPositions }) {
  const positions = req.args.map((value) => parseInt(value));
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

function handleSolution(req, data) {
  return {
    answer: ANSWER.OK,
    solution: data,
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
