const { n, k, imposIds } = require("./data");
const val = require("./validator");

const TYPE = Object.freeze({ QUESTION: "?", ANSWER: "!", SOLUTION: "=" });

function getNumImposters(arr) {
  return arr.reduce(
    (acc, value) => acc + (imposIds.includes(value) ? 1 : 0),
    0
  );
}

function getResult(query) {
  const parts = query.split(" ");
  let result;
  switch (parts[0]) {
    case TYPE.QUESTION:
      result = handleQues(parts.slice(1));
      break;
    case TYPE.ANSWER:
      result = handleAns(parts.slice(1));
      break;
    case TYPE.SOLUTION:
      result = { answer: "OK", solution: { n, k, imposIds } };
      break;
    default:
      result = { message: "Invalid query" };
      break;
  }
  if (result.message) result = { answer: "INVALID", ...result };
  return result;
}

function handleQues(arr) {
  const positions = arr.map((value) => parseInt(value));
  if (!val.allIntegers(positions))
    return {
      message: "Only integers are allowed",
    };
  if (!val.allInRange(positions, 1, n))
    return {
      message: `Numbers should be between 1 and ${n}`,
    };
  if (val.hasDuplicate(positions))
    return {
      message: "Duplicate numbers are not allowed",
    };
  if (arr.length !== 3)
    return {
      message: "Expected 3 numbers, but got " + arr.length,
    };
  return {
    answer: getNumImposters(positions) > 1 ? "MORE" : "LESS",
  };
}

function handleAns(arr) {
  arr = arr.map((value) => parseInt(value));
  if (!val.allIntegers(arr))
    return {
      message: "Only integers are allowed",
    };
  const [out_k, ...positions] = arr;
  if (!val.allInRange(positions, 1, n))
    return {
      message: `Numbers should be between 1 and ${n}`,
    };
  if (val.hasDuplicate(positions))
    return {
      message: "Duplicate numbers are not allowed",
    };
  const posMatch = positions.filter((value) => imposIds.includes(value));
  return {
    answer: posMatch.length === k ? "OK" : "PARTIAL",
    posMatch,
    accuracy: (posMatch.length / k).toFixed(6),
  };
}

module.exports = {
  TYPE,
  getResult,
  getNumImposters,
  handleQues,
  handleAns,
};
