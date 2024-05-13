const { getAnswer } = require('./index');
const messageGenerator = require('./messages');
const { QUERY_TYPE, ANSWER } = require('./constants');

describe('handlers', () => {
  describe('handleQuestion', () => {
    it('returns an object with a MORE answer', () => {
      const req = `${QUERY_TYPE.QUESTION} 1 2 3`;
      const result = getAnswer(req);
      expect(result).toEqual({ answer: ANSWER.MORE });
    });
    it('returns an object with a LESS answer', () => {
      const req = `${QUERY_TYPE.QUESTION} 3 4 5`;
      const result = getAnswer(req);
      expect(result).toEqual({ answer: ANSWER.LESS });
    });
    it('returns an object with an INVALID answer and a expected number message', () => {
      const req = `${QUERY_TYPE.QUESTION} 1 2`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.expectedNumber(3, 2),
      });
    });
    it('returns an object with an INVALID answer and a all integers message', () => {
      const req = `${QUERY_TYPE.QUESTION} 1 2 a`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.allowOnlyIntegers(),
      });
    });
    it('returns an object with an INVALID answer and a out of range message', () => {
      const req = `${QUERY_TYPE.QUESTION} 1 2 11`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.outOfRange(1, 6, '1, 2, 11'),
      });
    });
    it('returns an object with an INVALID answer and a no duplicates message', () => {
      const req = `${QUERY_TYPE.QUESTION} 1 2 2`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.noDuplicates(),
      });
    });
  });

  describe('handleAnswer', () => {
    it('returns an object with an OK answer', () => {
      const req = `${QUERY_TYPE.ANSWER} 1 2 4`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.OK,
        posMatch: [1, 2, 4],
        accuracy: '1.000000',
      });
    });
    it('returns an object with a PARTIAL answer', () => {
      const req = `${QUERY_TYPE.ANSWER} 1 2 3`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.PARTIAL,
        posMatch: [1, 2],
        accuracy: '0.666667',
      });
    });
    it('returns an object with an INVALID answer and a all integers message', () => {
      const req = `${QUERY_TYPE.ANSWER} 1 2 a`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.allowOnlyIntegers(),
      });
    });
    it('returns an object with an INVALID answer and a out of range message', () => {
      const req = `${QUERY_TYPE.ANSWER} 1 2 11`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.outOfRange(1, 6, '1, 2, 11'),
      });
    });
    it('returns an object with an INVALID answer and a no duplicates message', () => {
      const req = `${QUERY_TYPE.ANSWER} 1 2 2`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.noDuplicates(),
      });
    });
    it('returns an object with an INVALID answer and a redundant imposters message', () => {
      const req = `${QUERY_TYPE.ANSWER} 1 2 3 4 5 6`;
      const result = getAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.getMoreThanSolution(3, 6),
      });
    });
  });
});
