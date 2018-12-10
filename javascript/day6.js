const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings');

// Solves the challenge at: https://adventofcode.com/2018/day/6
getInputData.fromFile('../inputData/day6.txt')
  .then(input => {
    const coordsString = inputToStrings(input);
    const coords = parseCoords(coordsString);
    const grid1 = createGridPart1(coords);
    const largestFiniteArea = getLargestAreaSize(grid1);
    console.log('Answer1', largestFiniteArea);

    const grid2 = createGridPart2(coords);
    const safeAreaSize = getSafeRegionSize(grid2);
    console.log('Answer2', safeAreaSize);

  })
  .catch(err => console.log(err));

function parseCoords(strCoords) {
  return strCoords.map((coord, i) => {
    const xy = coord.match(/\d+/g);
    return { num: i, x: parseInt(xy[0]), y: parseInt(xy[1]) };
  });
}

function findMaxCoord(coords) {
  return coords.reduce((maxCoord, coord) => {
    const maxX = coord.x > maxCoord.x ? coord.x : maxCoord.x;
    const maxY = coord.y > maxCoord.y ? coord.y : maxCoord.y;

    return { x: maxX, y: maxY };
  }, { x: 0, y: 0 })
}

function createGridPart1(coords) {
  const maxCoord = findMaxCoord(coords);

  const grid = [];
  
  for (let row = 0; row <= maxCoord.y; row++) {
    grid[row] = [];
    
    for (let col = 0; col <= maxCoord.x; col++) {
      const cellCoord = { x: col, y: row };

      const closest = coords.reduce((closest, compareCoord) => {
        const distX = Math.abs(compareCoord.x - cellCoord.x);
        const distY = Math.abs(compareCoord.y - cellCoord.y);
        const distance = distX + distY;

        if (distance < closest.dist) {
          return { coordNum: compareCoord.num, dist: distance, duplicates: 0 }
        } else if (distance === closest.dist) {
          return { coordNum: '.', dist: distance, duplicates: closest.duplicates + 1  }
        } else {
          return closest;
        }
      }, { coordNum: 0, dist: Infinity, duplicates: 0 });

      grid[row][col] = closest.duplicates === 0 ? closest.coordNum : '.';
    };
  }

  return grid;
}

function getLargestAreaSize(grid) {
  const lastRow = grid.length - 1;
  const lastCol = grid[0].length - 1;

  const counts = {
    all: {},
    infinite: {}
  };

  for (let row = 0; row <= lastRow; row++) {
    for (let col = 0; col <= lastCol; col++) {
      const areaNum = grid[row][col];

      if (counts.infinite[areaNum] || row === 0 || row === lastRow || col === 0 || col === lastCol) {
        counts.infinite[areaNum] = true;
      } else {
        const newCount = counts.all[areaNum] ? counts.all[areaNum] + 1 : 1;
        counts.all[areaNum] = newCount;
      }
    }
  }

  let largestFiniteAreaSize = 0;

  Object.entries(counts.all).forEach(count => {
    const areaNum = count[0];
    const size = count[1];

    if (!counts.infinite[areaNum] && size > largestFiniteAreaSize) {
      largestFiniteAreaSize = size;
    }
  });
  
  return largestFiniteAreaSize;
}


function createGridPart2(coords) {
  const maxCoord = findMaxCoord(coords);
  const grid = [];
  
  for (let row = 0; row <= maxCoord.y; row++) {
    grid[row] = [];
    
    for (let col = 0; col <= maxCoord.x; col++) {
      const cellCoord = { x: col, y: row };

      // Get sum of distance to all coordinates
      const distanceSum = coords.reduce((sum, compareCoord) => {
        const distX = Math.abs(compareCoord.x - cellCoord.x);
        const distY = Math.abs(compareCoord.y - cellCoord.y);
        const distance = distX + distY;

        return sum + distance;
      }, 0);

      grid[row][col] = distanceSum < 10000 ? true : false;
    };
  }

  return grid;
}

function getSafeRegionSize(grid) {
  return grid.reduce((totalSize, row) => {
    return totalSize + row.reduce((colSize, col) => {
      return col ? colSize + 1 : colSize;
    }, 0)
  }, 0)
}