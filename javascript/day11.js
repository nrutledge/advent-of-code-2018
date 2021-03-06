// Solves the challenge at: https://adventofcode.com/2018/day/11
const sn = 8199;
const grid = Array.from({ length: 300 }, (_,y) => {
  return Array.from({ length: 300 }, (_,x) => {
    return calcPowerLevel(x + 1, y + 1);
  });
});

function calcPowerLevel(x, y) {
  const rackId = x + 10;
  return parseInt(((rackId * y + sn) * rackId).toString().slice(-3,-2)) - 5;
}

function calcSquare(leftIndex, topIndex, squareSize, grid) {
  let sum = 0;

  for (let i = topIndex; i < topIndex + squareSize; i++ ) {
    for (let j = leftIndex; j < leftIndex + squareSize; j++) {
      sum += grid[i][j];
    }
  }
  return sum;
}

function solvePart1(grid, squareSize) {
  let largest = { val: 0 };

  for (let r = 0; r <= grid.length - squareSize; r++) {
    for (let c = 0; c <= grid[0].length - squareSize; c++) {
      const sum = calcSquare(c, r, squareSize, grid)
      if (sum > largest.val) { 
        largest = { val: sum, x: c + 1, y: r + 1 }
      }
    }
  }
  return largest;
}

function solvePart2(grid) {
  let largest = { val: 0 }

  for (let i = 1; i <= grid.length; i++) {
    const res = solvePart1(grid, i);

    if (res.val > largest.val) {
      largest = { val: res.val, x: res.x, y: res.y, size: i };
    }
  }
  return largest;
}

console.log('Answer1', solvePart1(grid, 3));
console.log('Answer2', solvePart2(grid));