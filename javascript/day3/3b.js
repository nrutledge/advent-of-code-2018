const getInputData = require('../utils/getInputData');
const inputToStrings = require('../utils/inputToStrings');

// Solves the second challenge at: https://adventofcode.com/2018/day/3
getInputData.fromFile('../../inputData/day3.txt')
  .then(input => {
    const claims = inputToStrings(input);
    const parsedClaims = claims.map(claim => parseClaim(claim));
    const grid = fillGrid(parsedClaims);
    const answer = findNonOverlappingId(parsedClaims, grid);

    console.log(answer);
  })
  .catch(err => console.log(err));

function parseClaim(claim) {
  const parts = claim.replace(/[#:]|@ /g, '')
    .replace(/[,x]/g, ' ')
    .split(' ')
    .map(part => parseFloat(part));

  const left = parts[1];
  const top = parts[2];
  const width = parts[3];
  const height = parts[4];

  return { 
    id: parts[0],
    left,
    top,
    right: left + width - 1, 
    bottom: top + height - 1
  };
}

function fillGrid(claims) {
  const grid = [];

  claims.forEach(claim => {
    for (let row = claim.top; row <= claim.bottom; row++) {
      if (!grid[row]) { grid[row] = []; }
      for (let col = claim.left; col <= claim.right; col++) {
        const currCellVal = grid[row][col] || 0;

        grid[row][col] = currCellVal + 1;
      }
    }
  });

  return grid;
}

function findNonOverlappingId(claims, grid) {
  for (let i = 0; i < claims.length; i++) {
    const claim = claims[i];
    let overlapping = false;

    for (let row = claim.top; row <= claim.bottom && !overlapping; row++) {
      for (let col = claim.left; col <= claim.right && !overlapping; col++) {
        if (grid[row][col] > 1) {
          overlapping = true;
        }
      }
    }

    if (!overlapping) { return claim.id; }
  }
}