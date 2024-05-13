const { numPlayers, imposterPositions } = require('./data');
const handlers = require('./handlers');
const messageGenerator = require('./messages');
const { QUERY_TYPE, ANSWER } = require('./constants');

describe('handlers', () => {
  describe('getNumImposters', () => {
    it('returns the number of imposters in the positions array', () => {
      const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(handlers.getNumImposters(positions)).toBe(3);
    });
  });

  describe('handleInvalid', () => {
    it('returns an object with an INVALID answer and a message', () => {
      const message = 'This is an invalid message';
      const result = handlers.handleInvalid(message);
      expect(result).toEqual({ answer: ANSWER.INVALID, message });
    });
  });

  describe('handleQuestion', () => {
    it('returns an object with a MORE answer', () => {
      const req = { type: QUERY_TYPE.QUESTION, data: [1, 2, 3] };
      const result = handlers.handleQuestion(req);
      expect(result).toEqual({ answer: ANSWER.MORE });
    });
    it('returns an object with a LESS answer', () => {
      const req = { type: QUERY_TYPE.QUESTION, data: [3, 4, 5] };
      const result = handlers.handleQuestion(req);
      expect(result).toEqual({ answer: ANSWER.LESS });
    });
    it('returns an object with an INVALID answer and a expected number message', () => {
      const req = { type: QUERY_TYPE.QUESTION, data: [1, 2] };
      const result = handlers.handleQuestion(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.expectedNumber(3, 2),
      });
    });
    it('returns an object with an INVALID answer and a all integers message', () => {
      const req = { type: QUERY_TYPE.QUESTION, data: [1, 2, 'a'] };
      const result = handlers.handleQuestion(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.allowOnlyIntegers(),
      });
    });
    it('returns an object with an INVALID answer and a out of range message', () => {
      const req = { type: QUERY_TYPE.QUESTION, data: [1, 2, 11] };
      const result = handlers.handleQuestion(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.outOfRange(1, numPlayers, '1, 2, 11'),
      });
    });
    it('returns an object with an INVALID answer and a no duplicates message', () => {
      const req = { type: QUERY_TYPE.QUESTION, data: [1, 2, 2] };
      const result = handlers.handleQuestion(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.noDuplicates(),
      });
    });
  });

  describe('handleAnswer', () => {
    it('returns an object with an OK answer', () => {
      const req = {
        type: QUERY_TYPE.ANSWER,
        data: imposterPositions,
      };
      const result = handlers.handleAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.OK,
        posMatch: imposterPositions,
        accuracy: '1.000000',
      });
    });
    it('returns an object with a PARTIAL answer', () => {
      const req = { type: QUERY_TYPE.ANSWER, data: [1, 2, 3] };
      const result = handlers.handleAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.PARTIAL,
        posMatch: [1, 2],
        accuracy: '0.666667',
      });
    });
    it('returns an object with an INVALID answer and a all integers message', () => {
      const req = { type: QUERY_TYPE.ANSWER, data: [1, 2, 'a'] };
      const result = handlers.handleAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.allowOnlyIntegers(),
      });
    });
    it('returns an object with an INVALID answer and a out of range message', () => {
      const req = { type: QUERY_TYPE.ANSWER, data: [1, 2, 11] };
      const result = handlers.handleAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.outOfRange(1, numPlayers, '1, 2, 11'),
      });
    });
    it('returns an object with an INVALID answer and a no duplicates message', () => {
      const req = { type: QUERY_TYPE.ANSWER, data: [1, 2, 2] };
      const result = handlers.handleAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.noDuplicates(),
      });
    });
    it('returns an object with an INVALID answer and a redundant imposters message', () => {
      const req = { type: QUERY_TYPE.ANSWER, data: [1, 2, 3, 4, 5, 6] };
      const result = handlers.handleAnswer(req);
      expect(result).toEqual({
        answer: ANSWER.INVALID,
        message: messageGenerator.getMoreThanSolution(
          imposterPositions.length,
          6,
        ),
      });
    });
  });
});
