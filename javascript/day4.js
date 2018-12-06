const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings');

// Solves the challenge at: https://adventofcode.com/2018/day/4
getInputData.fromFile('../inputData/day4.txt')
  .then(input => {
    const logEntries = inputToStrings(input).sort();
    const parsedEntries = logEntries.map(entry => parseEntry(entry));
    const timelines = plotTimelines(parsedEntries);
    const aggregate = aggregateTimelines(timelines);
    console.log('answer1', solveStrategy1(aggregate));
    console.log('answer2', solveStrategy2(aggregate))
  })
  .catch(err => console.log(err));

// Takes a log entry string and returns an object with each detail as a prop
function parseEntry(entry) {
  const comment = entry.substring(19);
  return {
    year: parseInt(entry.substring(1,5)),
    month: parseInt(entry.substring(6,8)),
    day: parseInt(entry.substring(9,11)),
    hour: parseInt(entry.substring(12,14)),
    minute: parseInt(entry.substring(15,17)),
    guard: (comment.match(/#[0-9]+/) || [''])[0],
    type: (comment.match(/begin|sleep|wake/) || [''])[0]
  }
}

// Takes array of log entry objects, and returns an object of the following 
// structure: { #10: [0,0,0,1,1,1,2,2,1,0,...],
//              #15: [0,0,0,0,0,1,1,3,1,0,...], ... }
// Where each prop is the guard number and the value is a 60 elem array ( one
// for each minute from 00:00 to 00:59). Each value in the array represents
// how many days the gaurd was asleep during that minute.
function plotTimelines(entries) {
  const timelines = {};
  let currentGuard = '';

  for (let i = 0; i < entries.length; i++) {
    const { minute, guard, type } = entries[i];

    switch(type) {
      case 'begin':
        currentGuard = guard;
        if (!timelines[guard]) {
          (timelines[guard] = []).length = 60;
          timelines[guard].fill(0,0,60);
        }
        break;
      case 'sleep':
        const sleepStart = minute;
        const wakeStart = entries[i + 1].minute;
    
        for (let min = sleepStart; min < wakeStart; min++ ) {
          timelines[currentGuard][min] += 1;
        }
    }
  }

  return timelines;
}

// Takes the detailed timeline object and returns an object with only
// the key details for each guard
function aggregateTimelines(timelines) {
  const aggregate = {};

  Object.entries(timelines).forEach(entry => {
    const guard = entry[0];
    const timeline = entry[1];

    aggregate[guard] = timeline.reduce((acc, currSleepRepeats, currMin) => {
      const newSleepiestMin = currSleepRepeats > acc.sleepiestMin.repeats ? 
        { minute: currMin, repeats: currSleepRepeats } : 
        acc.sleepiestMin;

      return {
        sleepiestMin: newSleepiestMin,
        totalSleep: acc.totalSleep + currSleepRepeats
      }
    }, { sleepiestMin: { minute: 0, repeats: 0}, totalSleep: 0 });
  });

  return aggregate;
}

// Takes the aggregated guard details and returns the laziest guard's 
// id * sleepiest minute
function solveStrategy1(aggregatedTimeline) {
  const lazyGuard = Object.entries(aggregatedTimeline).reduce((acc, curr) => {
   const idNumber = parseInt(curr[0].replace('#',''));
   const minute = curr[1].sleepiestMin.minute;
   const totalSleep = curr[1].totalSleep;

   return totalSleep > acc.totalSleep ?  { idNumber, minute, totalSleep } : acc;
  }, { idNumber: 0, minute: 0, totalSleep: 0});

  return lazyGuard.idNumber * lazyGuard.minute;
}

// Takes the aggregated guard details and returns the id number of the guard
// asleep most often during a particular minute multiplied by that minute.
// Almost the same as solveStrategy1 but too lazy to DRY up.
function solveStrategy2(aggregatedTimeline) {
  const habitualGuard = Object.entries(aggregatedTimeline).reduce((acc, curr) => {
    const idNumber = parseInt(curr[0].replace('#',''));
    const minute = curr[1].sleepiestMin.minute;
    const repeats = curr[1].sleepiestMin.repeats;

    return repeats > acc.repeats ? { idNumber, minute, repeats } : acc;
  }, { idNumber: 0, minute: 0, repeats: 0 });

  return habitualGuard.idNumber * habitualGuard.minute;
}