const getInputData = require('../utils/getInputData');
const inputToNums = require('../utils/inputToNums');

// Solves the first challenge at: https://adventofcode.com/2018/day/1
getInputData.fromFile('../../inputData/day1.txt')
  .then(input => {
    const changes = inputToNums(input);
    const answer = changes.reduce((acc, curr) => acc + curr, 0);

    console.log(answer);
  })
  .catch(err => console.log(err));