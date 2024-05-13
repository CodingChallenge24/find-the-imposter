const getKey = (obj, value) =>
  Object.keys(obj).find((key) => obj[key] === value);

const QUERY_TYPE = Object.freeze({
  QUESTION: "?",
  ANSWER: "!",
  SOLUTION: "=",
  getKey: (value) => getKey(QUERY_TYPE, value),
});

const ANSWER = Object.freeze({
  INVALID: "INVALID",
  OK: "OK",
  PARTIAL: "PARTIAL",
  LESS: "LESS",
  MORE: "MORE",
  getKey: (value) => getKey(ANSWER, value),
});

module.exports = { QUERY_TYPE, ANSWER };
