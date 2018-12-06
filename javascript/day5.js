const getInputData = require('./utils/getInputData');

// Solves the challenge at: https://adventofcode.com/2018/day/5
getInputData.fromFile('../inputData/day5.txt')
.then(input => {
  console.log('answer1', reducePolymer(input).length);
  console.log('answer2', findBestReduction(input));
})
.catch(err => console.log(err));  

// Takes input polymer string and returns a reduced output string according to 
// these rules:
//    - Adjacent letters that are the same but different case (e.g., aA) are deleted
//    - Process continues until no such adjacent characters remain
function reducePolymer(polymer, removeChar = false) {
  const units = polymer.split('');

  for (let i = 0;;) {
    if (!units[i] || !units[i+1]) { 
      return units.join(''); 
    }

    const unitA = units[i];
    const unitB = units[i + 1];

    if (removeChar && unitA.toLowerCase() === removeChar.toLowerCase()) {
      units.splice(i,1);
      i > 0 && i--;
      continue;
    }

    if (unitA.toLowerCase() !== unitB.toLowerCase() || unitA === unitB) { 
      i++;
      continue;
    }

    let isUnitALowerCase = unitA.toLowerCase() === unitA ? true : false;
    let isUnitBLowerCase = unitB.toLowerCase() === unitB ? true : false;

    if (isUnitALowerCase !== isUnitBLowerCase) {
      units.splice(i,2);
      i > 0 && i--;
    }
  }
}

// Takes input polymer string and outputs length of the best reduction
// where the best reduction is the result of moving a particular character
// from the entire string and then reducing what remains.
function findBestReduction(polymer) {
  const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return chars.reduce((acc, char) => {
    const resultLength = reducePolymer(polymer, char).length;
    return (!acc.char || resultLength < acc.resultLength) ? { char, resultLength } : acc;
  }, {})
}