const getInputData = require('../utils/getInputData');
const inputToStrings = require('../utils/inputToStrings');

// Solves the first challenge at: https://adventofcode.com/2018/day/3
getInputData.fromFile('../../inputData/day3.txt')
  .then(input => {
    const claims = inputToStrings(input);
    const grid = fillGrid(claims);
    const answer = countOverlap(grid);

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

function fillGrid (claims) {
  const grid = [];

  claims.forEach(claim => {
    const coords = parseClaim(claim);

    for (let row = coords.top; row <= coords.bottom; row++) {
      if (!grid[row]) { grid[row] = []; }
      for (let col = coords.left; col <= coords.right; col++) {
        const currCellVal = grid[row][col] || 0;

        grid[row][col] = currCellVal + 1;
      }
    }
  });

  return grid;
}

function countOverlap(grid) {
  let sum = 0;

  grid.forEach((row, i) => {
    row.forEach((col, j) => {
      if (grid[i][j] > 1) {
        sum += 1;
      }
    })
  })

  return sum;
}