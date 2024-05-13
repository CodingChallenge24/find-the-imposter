const { getResult } = require('./handlers');
const [dataRef, loadData] = require('./data');

function getAnswer(req) {
  return getResult(req, dataRef.current);
}

module.exports = { getAnswer, loadData };
