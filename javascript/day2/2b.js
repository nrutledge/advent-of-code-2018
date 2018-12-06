const getInputData = require('../utils/getInputData');
const inputToStrings = require('../utils/inputToStrings');

// Solves the second challenge at: https://adventofcode.com/2018/day/2
getInputData.fromFile('../../inputData/day2.txt')
  .then(input => {
    const ids = inputToStrings(input);
    const diffByOneIds = findDiffByOneChar(ids);
    const answer = findLettersInCommon(diffByOneIds);
    
    console.log(answer);
  })
  .catch(err => console.log(err));

// Takes array of strings, sorts them and then returns the first two elements 
// that differ by only a single character
function findDiffByOneChar(strings) {
  const sortedStrings = strings.sort();
  
  for (let i = 1; i < sortedStrings.length; i++) {
    let currString = sortedStrings[i];
    let prevString = sortedStrings[i - 1];
    let diffCount = 0;

    for (let j = 0; j < currString.length && diffCount < 2; j++) {
      if (currString[j] !== prevString[j]) {
        diffCount += 1;
      }
    }

    if (diffCount < 2) { return [prevString, currString] }
  }
}

// Takes array of two strings and returns a single string containing all
// matching characters
function findLettersInCommon(strings) {
  const stringOneChars = strings[0].split('');
  const stringTwoChars = strings[1].split('');

  return stringOneChars.filter((char, index) => {
    return char === stringTwoChars[index];
  }).join('');
}

 
