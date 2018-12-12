const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings');

// Solves the challenge at: https://adventofcode.com/2018/day/12
getInputData.fromFile('../inputData/day12.txt')
  .then(input => {
    const lines = inputToStrings(input);
    const initialState = lines[0].slice(15);
    const notes = parseNotes(lines.slice(1));
    console.log('Answer1', solvePart1(initialState, notes, 20));
    console.log('Answer2', solvePart2(initialState, notes, 50000000000));
  })
  .catch(err => console.log(err));

function parseNotes(notes) {
  return notes.map(note => {
    return {
      pattern: note.slice(0,5),
      result: note.slice(-1)
    }
  })
}

function generate(potsState, notes, p0Index) {
  if (potsState.slice(0,4).match(/#+/)) { 
    potsState = '....' + potsState; 
    p0Index += 4;
  } 
  if (potsState.slice(-4).match(/#+/)) {
    potsState = potsState + '....';
  } 

  let newPots = '';

  for (let i = 0; i < potsState.length; i++) {
    newPots += notes.reduce((a,note) => {
      let pattern = note.pattern;
      const section = potsState.slice(i-2,i+3);

      if (section === pattern) {
        return note.result;
      }
      return a;
    }, '.');
  }
  return { state: newPots, p0Index }
}

function solvePart1(potsState, notes, rounds) {
  let pots = { state: potsState, p0Index: 0 };

  for (let i = 1; i <= rounds; i++) {
   pots = generate(pots.state, notes, pots.p0Index);
  }
  return pots.state.split('').reduce((a,c,i) => {
    return c === '#' ? a + i - pots.p0Index : a
  }, 0);
}

function solvePart2(potsState, notes, rounds) {
  let pots = { state: potsState, p0Index: 0 };
  let diff = 0;
  let sum = 0;

  for (let i = 1; i <= rounds; i++) {
   pots = generate(pots.state, notes, pots.p0Index);
   const newSum = (pots.state.split('').reduce((a,c,i) => {
      return c === '#' ? a + i - pots.p0Index : a;
    }, 0));

    let newDiff = newSum - sum;
    
    if (newDiff === diff) { 
      return newSum + ((rounds - i) * diff);
    }

    sum = newSum;
    diff = newDiff;
  }
  return sum;
}