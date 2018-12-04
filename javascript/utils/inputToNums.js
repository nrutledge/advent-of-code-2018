module.exports = (inputData => {
  const strArray = inputData.split('\n');

  return strArray.reduce((acc, curr) => {
    changes = parseFloat(curr);
    return isNaN(changes) ? acc : [ ...acc, changes ];
  }, []);
});

