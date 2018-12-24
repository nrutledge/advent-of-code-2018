const getInputData = require('./utils/getInputData');

// Solves the challenge at: https://adventofcode.com/2018/day/14
getInputData.fromFile('../inputData/day14.txt')
  .then(input => {
    const recipes = [3, 7];
    const currRecipeIndexes = [0, 1];
    console.log('Answer1', solvePart1(recipes, currRecipeIndexes, parseInt(input)));
    console.log('Answer2', solvePart2(recipes, currRecipeIndexes, input));
  })
  .catch(err => console.log(err));

function createNextRecipes(recipes, currRecipeIndexes) {
  const sum = currRecipeIndexes.reduce((sum, currIndex) => {
    return sum + recipes[currIndex];
  }, 0);
  const nextRecipes = sum.toString().split('').map(str => parseInt(str));

  return nextRecipes;
}

function getNextRecipeIndexes(recipes, currRecipeIndexes) {
  const recipesLen = recipes.length;

  return currRecipeIndexes.map(index => {
    const shift = recipes[index] + 1;
    return (index + shift) % recipesLen;
  });
}

function generateRecipes(recipes, currRecipeIndexes, stopNumber = false, stopSequence = false) {
  const stopSequenceLen = stopSequence.length;
  let newRecipes = [...recipes];
  let newIndexes = [...currRecipeIndexes];
  let recipeCount = newRecipes.length;

  while (!stopNumber || recipeCount < stopNumber) {
    const nextRecipes = createNextRecipes(newRecipes, newIndexes);

    for (let i = 0; i < nextRecipes.length; i++) {
      newRecipes.push(nextRecipes[i]);
      if (stopSequence && newRecipes.slice(stopSequenceLen * -1).join('') === stopSequence) {
        return newRecipes;
      }
    }
    newIndexes = getNextRecipeIndexes(newRecipes, newIndexes);
    recipeCount = newRecipes.length;
  }

  return newRecipes;
}

function solvePart1(startRecipes, currRecipeIndexes, recipeNum) {
  const newRecipes = generateRecipes(startRecipes, currRecipeIndexes, recipeNum + 10);
  return newRecipes.slice(recipeNum, recipeNum + 11).join('');
}

function solvePart2(startRecipes, currRecipeIndexes, testScores) {
  const newRecipes = generateRecipes(startRecipes, currRecipeIndexes, false, testScores);
  return newRecipes.length - testScores.length;
}