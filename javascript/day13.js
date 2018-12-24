const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings');

// Solves the challenge at: https://adventofcode.com/2018/day/13
getInputData.fromFile('../inputData/day13.txt')
  .then(input => {
    const { grid, carts } = parseInput(input);
    console.log('Answer1', solve(grid, carts, false));
    console.log('Answer2', solve(grid, carts, true));
  })
  .catch(err => console.log(err));

function Cart(id, x, y, dir) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.dir = dir;
  this.turnChoice = 'l';
}

Cart.prototype.getNextTurnChoice = function() { 
  switch(this.turnChoice) {
    case 'l':
      return 'f';
    case 'f':
      return 'r';
    case 'r':
      return'l';
  }
};

function parseInput(input) {
  let grid = inputToStrings(input).map(row => row.split(''));
  let carts = [];

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      switch(cell) {
        case '^':
        case '>':
        case 'v':
        case '<':
          const lastCart = carts[carts.length - 1];
          const id = (lastCart && lastCart.id + 1) || 1;
          carts.push(new Cart(id, x, y, cell));
          grid[y][x] = fillCell(grid, x, y);
      }
    });
  });
  return { grid, carts };
}

function getNeighbours(grid, x, y) {
  const above = grid[y -1] ? grid[y -1][x] : ' ';
  const right = grid[y][x + 1] || ' ';
  const below = grid[y + 1] ? grid[y + 1][x] : ' ';
  const left  = grid[y][x - 1] || ' ';

  return { above, right, below, left };
}

function fillCell(grid, x, y) {
  const { above, right, below, left } = getNeighbours(grid, x, y);

  const connectedAbove = above === ' ' || above === '-' ? false : true;
  const connectedRight = right === ' ' || right === '|' ? false : true;
  const connectedBelow = below === ' ' || below === '-' ? false : true;
  const connectedLeft  = left  === ' ' || left  === '|' ? false : true;

  if (connectedAbove && connectedRight && connectedBelow && connectedLeft) {
    return '+';
  } 
  if (connectedAbove && connectedBelow && (!connectedLeft || !connectedRight)) {
    return '|';
  }
  if (connectedLeft && connectedRight && (!connectedAbove || !connectedBelow)) {
    return '-';
  }
  if ((connectedBelow && connectedRight) || (connectedAbove && connectedLeft)) {
    return '/';
  }
  if ((connectedBelow && connectedLeft) || (connectedAbove && connectedRight)) {
    return '\\';
  }
  else {
    return '*' // Something messed up!
  }
}

function sortCarts(carts) {
  return carts.sort((a, b) => {
    if (a.y < b.y) { 
      return -1; 
    } else if (a.y > b.y) {
      return 1;
    } else {
      if (a.x < b.x) {
        return -1;
      } else if (a.x > b.x) { 
        return 1;
      } else {
        return 0;
      }
    }
  })
}

function solve(grid, carts, part2 = false) {
  let newCarts = carts.map(({ id, x, y, dir }) => new Cart(id, x, y, dir));
  let collisionMap = new Map();

  while (true) {
    newCarts = sortCarts(newCarts);

    for (let i = 0; i < newCarts.length; i++) {
      const cart = newCarts[i];

      const trackSegment = grid[cart.y][cart.x];
      const { id, x, y, dir, turnChoice } = cart;
      let newX = x;
      let newY = y;
      let newDir = dir;
      let newTurnChoice = turnChoice;

      switch(trackSegment) {
        case '/':
          switch (dir) {
            case '^':
              newX = x + 1;
              newDir = '>';
              break;
            case '>':
              newY = y - 1;
              newDir = '^';
              break;
            case 'v':
              newX = x - 1;
              newDir = '<';
              break;
            case '<':
              newY = y + 1;
              newDir = 'v';
              break;
          }
          break;
        case '\\':
          switch (dir) {
            case '^':
              newX = x - 1;
              newDir = '<';
              break;
            case '>':
              newY = y + 1;
              newDir = 'v';
              break;
            case 'v':
              newX = x + 1;
              newDir = '>';
              break;
            case '<':
              newY = y - 1;
              newDir = '^';
              break;
          }
          break;
        case '+':
          switch(dir) {
            case '^':
              switch(turnChoice) {
                case 'l':
                  newDir = '<';
                  newX = x - 1;
                  break;
                case 'f':
                  newDir = '^';
                  newY = y - 1;
                  break;
                case 'r':
                  newDir = '>';
                  newX = x + 1;
                  break;
              }
              break;
            case '>':
              switch(turnChoice) {
                case 'l':
                  newDir = '^';
                  newY = y - 1;
                  break;
                case 'f':
                  newDir = '>';
                  newX = x + 1;
                  break;
                case 'r':
                  newDir = 'v';
                  newY = y + 1;
                  break;
              }
              break;
            case 'v':
              switch(turnChoice) {
                case 'l':
                  newDir = '>';
                  newX = x + 1;
                  break;
                case 'f':
                  newDir = 'v';
                  newY = y + 1;
                  break;
                case 'r':
                  newDir = '<';
                  newX = x - 1;
                  break;
              }
              break;
            case '<':
              switch(turnChoice) {
                case 'l':
                  newDir = 'v';
                  newY = y + 1;
                  break;
                case 'f':
                  newDir = '<';
                  newX = x - 1;
                  break;
                case 'r':
                  newDir = '^';
                  newY = y - 1;
                  break;
              }
              break;
          }
          newTurnChoice = cart.getNextTurnChoice();
          break;
        default:
          switch(dir) {
            case '^':
              newDir = '^';
              newY = y - 1;
              break;
            case '>':
              newDir = '>';
              newX = x + 1;
              break;
            case 'v':
              newDir = 'v';
              newY = y + 1;
              break;
            case '<':
              newDir = '<'
              newX = x - 1;
              break;
          }
      }

      collisionMap.delete(`${x},${y}`);
      const newCoords = `${newX},${newY}`;
      const collidingCartId = collisionMap.get(newCoords);

      if (collidingCartId) {
        if (part2) { 
          // Remove current cart
          newCarts.splice(i, 1);
          i--;

          // Remove colliding cart
          collisionMap.delete(newCoords);
          const collidingCartIndex = newCarts.findIndex(cart => cart.id === collidingCartId);
          newCarts.splice(collidingCartIndex, 1);
          if (i >= collidingCartIndex) { i--; }
        } else {
          return newCoords; 
        }
      } else {
        collisionMap.set(newCoords, id);
        cart.x = newX;
        cart.y = newY;
        cart.dir = newDir;
        cart.turnChoice = newTurnChoice;
      }
    }
    if (newCarts.length === 1) { 
      return newCarts[0].x + ',' + newCarts[0].y; 
    }
  }
}
