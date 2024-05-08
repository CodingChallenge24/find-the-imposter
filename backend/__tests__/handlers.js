const handlers = require("../handlers");

describe("handlers", () => {
  describe("getNumImposters", () => {
    it("should return the number of imposters in the array", () => {
      const arr = [1, 2, 3, 4, 5];
      const imposIds = [1, 3, 5];
      expect(handlers.getNumImposters(arr, imposIds)).toBe(3);
    });
  });

  describe("getResult", () => {
    it("should return the result of the query", () => {
      const query = "? 1 2 3";
      const n = 5;
      const imposIds = [1, 3, 5];
      expect(handlers.getResult(query, n, imposIds)).toEqual({
        answer: "MORE",
      });
    });
  });

  describe("handleQues", () => {
    it("should return an object with the answer", () => {
      const arr = [1, 2, 3];
      expect(handlers.handleQues(arr)).toEqual({ answer: "MORE" });
    });
  });

  describe("handleAns", () => {
    it("should return an object with the answer", () => {
      const arr = [2, 2, 3];
      expect(handlers.handleAns(arr)).toEqual({
        answer: "PARTIAL",
        posMatch: [2],
        accuracy: "0.333333",
      });
    });
  });
});
