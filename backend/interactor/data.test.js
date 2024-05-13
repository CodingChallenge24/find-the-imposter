const { getAnswer, loadData } = require('./index');
const { handleInvalid } = require('./handlers');
const messageGenerator = require('./messages');

describe('data', () => {
  it('should return an object with answer OK', () => {
    const data = { numPlayers: 6, results: '1 2 3' };
    const expected = { answer: 'OK' };
    expect(loadData(data)).toEqual(expected);
  });
  it('should return an object with answer INVALID and a not a number message', () => {
    const data = { numPlayers: 'a', results: '1 2 3' };
    const expected = {
      answer: 'INVALID',
      message: messageGenerator.notANumber('a'),
    };
    expect(loadData(data)).toEqual(expected);
  });
  it('should return an object with answer INVALID and a out of range message', () => {
    const data = { numPlayers: 101, results: '1 2 3' };
    const expected = {
      answer: 'INVALID',
      message: messageGenerator.outOfRange(6, 100, 101),
    };
    expect(loadData(data)).toEqual(expected);
  });
  it('should return an object with answer INVALID and a all integers message', () => {
    const data = { numPlayers: 6, results: '1 2 a' };
    const expected = {
      answer: 'INVALID',
      message: messageGenerator.allowOnlyIntegers(),
    };
    expect(loadData(data)).toEqual(expected);
  });
  it('should return an object with answer INVALID and a out of range message', () => {
    const data = { numPlayers: 6, results: '1 2 7' };
    const expected = {
      answer: 'INVALID',
      message: messageGenerator.outOfRange(1, 6, '1,2,7'),
    };
    expect(loadData(data)).toEqual(expected);
  });
  it('should return an object with answer INVALID and a no duplicates message', () => {
    const data = { numPlayers: 6, results: '1 2 2' };
    const expected = {
      answer: 'INVALID',
      message: messageGenerator.noDuplicates(),
    };
    expect(loadData(data)).toEqual(expected);
  });
});
