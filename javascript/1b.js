getInputData = require('./utils/getInputData');
inputToNums = require('./utils/inputToNums');

getInputData.fromFile('../inputData/day1.txt')
  .then(input => {
    changes = inputToNums(input);
    const answer = findFirstRepeat(changes);
    console.log(answer);
  })
  .catch(err => console.log(err));

function findFirstRepeat(changes) {
  // Track each frequency that has been encountered
  const frequencies = { 0: true }
    
  let currentFreq = 0;
  let repeatFound = false;

  // Cycle through frequency changes repeatedly
  while (!repeatFound) {
    for (let i = 0; i < changes.length; i++) {
      const newFreq = currentFreq + changes[i];
      
      // Stop as soon as current freq has already been encountered
      if (frequencies[newFreq]) { 
        return newFreq; }
  
      frequencies[newFreq] = true;
      currentFreq = newFreq;
    }
  }
}