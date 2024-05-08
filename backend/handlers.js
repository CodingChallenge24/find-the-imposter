const { n, k, imposIds } = require("./data");
const { hasDuplicate } = require("./validator");

const TYPE = Object.freeze({ QUESTION: "?", ANSWER: "!", SOLUTION: "=" });

function getNumImposters(arr) {
  return arr.reduce(
    (acc, value) => acc + (imposIds.includes(value) ? 1 : 0),
    0
  );
}

function getResult(query) {
  const parts = query.split(" ");
  switch (parts[0]) {
    case TYPE.QUESTION:
      return handleQues(parts.slice(1));
    case TYPE.ANSWER:
      return handleAns(parts.slice(1));
    case TYPE.SOLUTION:
      return { answer: "OK", solution: { n, k, imposIds } };
    default:
      return { answer: "INVALID", message: "Invalid query" };
  }
}

function handleQues(arr) {
  if (arr.length !== 3)
    return {
      answer: "INVALID",
      message: "Expected 3 numbers, but got " + arr.length,
    };
  const positions = arr.map((value) => parseInt(value));
  if (hasDuplicate(positions))
    return {
      answer: "INVALID",
      message: "Duplicate numbers are not allowed",
    };
  return {
    answer: getNumImposters(positions) > 1 ? "MORE" : "LESS",
  };
}

function handleAns(arr) {
  const [out_k, ...positions] = arr.map((value) => parseInt(value));
  if (hasDuplicate(positions))
    return {
      answer: "INVALID",
      message: "Duplicate numbers are not allowed",
    };
  const posMatch = positions.filter((value) => imposIds.includes(value));
  return {
    answer: posMatch.length === k ? "OK" : "PARTIAL",
    posMatch,
    accuracy: (posMatch.length / k).toFixed(6),
  };
}

module.exports = getResult;
