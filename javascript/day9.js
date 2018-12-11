const getInputData = require('./utils/getInputData');

// Solves the challenge at: https://adventofcode.com/2018/day/9
getInputData.fromFile('../inputData/day9.txt')
  .then(input => {
    const [playerCount, lastMarblePts] = input.match(/\d+/g).map(str => parseInt(str));
    console.log('Answer1', solve(playerCount, lastMarblePts));
    console.log('Answer2', solve(playerCount, lastMarblePts * 100));
  })
  .catch(err => console.log(err));

function Marble(val, prev, next) {
  this.val = val;
  this.prev = prev || this;
  this.next = next || this;
}

function solve(playerCount, lastMarblePts) {
  const scores = Array.from({ length: playerCount }).fill(0);
  let currMarble = new Marble(0);

  for (i = 1; i <= lastMarblePts; i++) {
    if (i % 23 === 0) {
      const takeMarble = Array
        .from({ length: 7 })
        .reduce((acc, _) => acc.prev, currMarble);

      takeMarble.prev.next = takeMarble.next;
      takeMarble.next.prev = takeMarble.prev;
      scores[i % playerCount - 1] += i + takeMarble.val;
      currMarble = takeMarble.next;
    } else {
      const newMarble = new Marble(i);
      const prevMarble = currMarble.next;
      const nextMarble = prevMarble.next;
      
      prevMarble.next = newMarble;
      newMarble.prev = prevMarble;
      newMarble.next = nextMarble;
      nextMarble.prev = newMarble;
      currMarble = newMarble;
    }
  }

  return scores.reduce((highest, curr) => curr > highest ? curr : highest);
}
