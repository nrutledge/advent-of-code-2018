const length = 9999999



console.time('test2');
const arr2 = [...Array(length)].map((_,i) => i);
console.timeEnd('test2')

console.time('test1');
const arr1 = Array.from({ length: length }, (_,i) => i);
console.timeEnd('test1')