const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings') ;

// Solves the challenge at: https://adventofcode.com/2018/day/9
getInputData.fromFile('../inputData/day10.txt')
  .then(input => {
    const startPoint = inputToStrings(input).map(str => { 
      const [x, y, xV, yV] = str.match(/-*\d+/g).map(str => parseInt(str));
      return { x, y, xV, yV };
    });
    const { answer1, answer2 } = solve(startPoint);
    console.log(answer1);
    console.log('Seconds: ', answer2);
  })
  .catch(err => console.log(err));

function plotGrid(coords, minX, maxX, minY, maxY) {
  const grid = Array.from({ length: maxY - minY + 1 }, (_, i) => {
    return new Array(maxX - minX + 1).fill(' ');
  });
  coords.forEach(pt => {
    grid[pt.y - minY][pt.x - minX] = '#'
  });

  return grid.map(row => row.join(''));
}

function calcBounds(coords) {
  const { minX, maxX, minY, maxY } = coords.reduce((a, c) => {
    return {
      minX: c.x < a.minX || a.minX === undefined ? c.x : a.minX,
      maxX: c.x > a.maxX || a.maxX === undefined ? c.x : a.maxX,
      minY: c.y < a.minY || a.minY === undefined ? c.y : a.minY,
      maxY: c.y > a.maxY || a.maxY === undefined ? c.y : a.maxY,
    }
  }, {});
  const height = maxY - minY;

  return { minX, maxX, minY, maxY, height };
}

function calcNextCoords(coords) {
  return newCoords = coords.map(({ x, y, xV, yV }) => {
    return {
      x: x + xV, 
      y: y + yV, 
      xV,
      yV
    }
  });
}

function solve(coords) {
  let seconds = 0;
  let { minX, maxX, minY, maxY, height } = calcBounds(coords);

  while (true) {
    const newCoords = calcNextCoords(coords);
    const { 
      minX: newMinX, 
      maxX: newMaxX, 
      minY: newMinY, 
      maxY: newMaxY,
      height: newHeight
    } = calcBounds(newCoords);

    if (newHeight > height) { 
      return {
        answer1: plotGrid(coords, minX, maxX, minY, maxY),
        answer2: seconds
      }
    }

    seconds++;
    coords = newCoords;
    height = newHeight;
    minX = newMinX;
    maxX = newMaxX;
    minY = newMinY;
    maxY = newMaxY;
  }
}
