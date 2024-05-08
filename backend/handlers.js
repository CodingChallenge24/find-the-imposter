const { QUERY_TYPE, ANSWER } = require("./constants");
const { n, k, imposIds } = require("./data");
const messageGenerator = require("./messages");
const validator = require("./validator");

function getResult(query) {
  const [type, ...data] = query.split(" ");
  return handleQueryType({ type, data });
}

function getNumImposters(positions) {
  return positions.filter((value) => imposIds.includes(value)).length;
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
  if (!validator.allInRange(positions, 1, n))
    return handleInvalid(
      messageGenerator.outOfRange(1, n, positions.join(", "))
    );
  if (validator.hasDuplicate(positions))
    return handleInvalid(messageGenerator.noDuplicates());
  return {
    answer: getNumImposters(positions) > 1 ? ANSWER.MORE : ANSWER.LESS,
  };
}

function handleAnswer(req) {
  const tmp = req.data.map((value) => parseInt(value));
  if (!validator.allIntegers(tmp))
    return handleInvalid(messageGenerator.allowOnlyIntegers());
  const [out_k, ...positions] = tmp;
  if (!validator.expectedNumber(out_k, positions.length))
    return handleInvalid(
      messageGenerator.expectedNumber(out_k, positions.length)
    );
  if (!validator.allInRange(positions, 1, n))
    return handleInvalid(
      messageGenerator.outOfRange(1, n, positions.join(", "))
    );
  if (validator.hasDuplicate(positions))
    return handleInvalid(messageGenerator.noDuplicates());
  const posMatch = positions.filter((value) => imposIds.includes(value));
  return {
    answer: posMatch.length === out_k ? ANSWER.OK : ANSWER.PARTIAL,
    posMatch,
    accuracy: (posMatch.length / k).toFixed(6),
  };
}

function handleSolution(req) {
  return {
    answer: ANSWER.OK,
    solution: { n, k, imposIds },
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
