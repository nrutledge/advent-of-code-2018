module.exports = ((inputData, excludeEmpty = true) => {
  const strings = inputData.split('\n')
  
  return excludeEmpty ? 
    strings.filter(string => string !== '') :
    strings;
});

