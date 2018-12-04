getInputData = require('./utils/getInputData');
inputToStrings = require('./utils/inputToStrings');

getInputData.fromFile('../inputData/day2.txt')
  .then(input => {
    const ids = inputToStrings(input);
    const lettersCounts = countLetters(ids);
    const answer = getChecksum(lettersCounts);
    
    console.log(answer);
  })
  .catch(err => console.log(err));

  // Returns array of objects containing the count of each letter in the id
  // Example: 'bababc' => { a: 2, b: 3, c: 1 }
  function countLetters(strings) {
    return strings.map(currString => {
      const letters = currString.split('');

      return letters.reduce((acc, currLetter) => {
        const newAcc = { ...acc };
        newAcc[currLetter] = acc[currLetter] ? acc[currLetter] + 1 : 1;
        return newAcc;
      }, {})
    });
  }

  // Takes array of letter count objects and returns checksum
  // Checksum = (number of ids containing two of the same letter) *
  //            (number of ids containing three of the same letter)
  function getChecksum(lettersCounts) {
    const twoThreeCounts = lettersCounts.reduce((acc, currLettersCount) => {
      let containsTwo = 0;
      let containsThree = 0;

      Object.entries(currLettersCount).forEach(letterCount => {
        if (letterCount[1] === 2) {
          containsTwo = 1;
        } else if (letterCount[1] === 3) {
          containsThree = 1; 
        }
      });

      return {
        twoCount: acc.twoCount + containsTwo,
        threeCount: acc.threeCount + containsThree
      }
    }, {
      twoCount: 0,
      threeCount: 0
    });

    const { twoCount, threeCount } = twoThreeCounts;
    return twoCount * threeCount;
  }