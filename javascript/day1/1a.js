const getInputData = require('../utils/getInputData');
const inputToNums = require('../utils/inputToNums');

getInputData.fromFile('../../inputData/day1.txt')
  .then(input => {
    const changes = inputToNums(input);
    const answer = changes.reduce((acc, curr) => acc + curr, 0);

    console.log(answer);
  })
  .catch(err => console.log(err));