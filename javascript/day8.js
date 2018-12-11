const getInputData = require('./utils/getInputData');

// Solves the challenge at: https://adventofcode.com/2018/day/8
getInputData.fromFile('../inputData/day8.txt')
  .then(input => {
    const nums = input.split(' ').map(n => parseInt(n));
    const tree = buildTree(nums);
    console.log('Answer1', solvePart1(tree));
    console.log('Answer2', solvePart2(tree));
  })
  .catch(err => console.log(err));

// Index to keep track of current position in input through recursive calls
let i = 0;

function nextNum(nums) {
  i++;
  return nums[i - 1];
}

function buildTree(nums) {
  const cQty = nextNum(nums);
  const mQty = nextNum(nums);
  const children = Array.from({ length: cQty }).map(_ => buildTree(nums));
  const metadata = Array.from({ length: mQty }).map(_ => nextNum(nums));

  return { children, metadata };
}

function solvePart1(node) {
  return node.metadata.reduce((sum, n) => sum + n) 
    + node.children.reduce((sum, child) => sum + solvePart1(child), 0);
}

function solvePart2(node) {
  if (!node) { 
    return 0; 
  } else if (node.children.length === 0) {
    return node.metadata.reduce((sum, n) => sum + n);
  } else {
    return node.metadata.reduce((sum, n) => {
      return sum + solvePart2(node.children[n - 1]);
    }, 0);
  }
}