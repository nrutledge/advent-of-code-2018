const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings');

// Solves the challenge at: https://adventofcode.com/2018/day/7
getInputData.fromFile('../inputData/day7.txt')
  .then(input => {
    const instructions = inputToStrings(input);
    const dependencies = createDependencies(instructions, 60);
    console.log('Answer1', solvePart1(dependencies));
    console.log('Answer2', solvePart2(dependencies, 5));
  })
  .catch(err => console.log(err));

  function parseInstruction(instruction) {
    const dep = instruction.substring(5,6);
    const step = instruction.substring(36, 37);

    return { dep, step };
  }

function createDependencies(instructions, baseTime = 60) {
  const steps = {};

  instructions.forEach(instruction => {
    const { dep, step } = parseInstruction(instruction);

    if (!steps[dep]) { 
      steps[dep] = ({ name: dep, deps: [] }); 
    }

    if (!steps[step]) {
      steps[step] = ({ name: step, deps: [steps[dep]] });
    } else {
      steps[step].deps.push(steps[dep]);
    }
  });

  const sortedSteps = {};

  Object.keys(steps).sort().forEach(step => {   
    const time = baseTime + (step.charCodeAt(0) - 64);
    sortedSteps[step] = { name: step, deps: steps[step].deps, time };
  });

  return sortedSteps;
}

function findStepSequence(deps) {
  const inputSteps = Object.keys(deps);
  const outputSteps = [];
  let i = 0;
  
  while (inputSteps.length > 0) {
    const currStep = deps[inputSteps[i]];
    let hasNoActiveDeps = true;

    if (currStep.deps.length > 0) {
      for (let j = 0; j < currStep.deps.length; j++) {
        const dep = currStep.deps[j];

        // Move on to next step if current step has active dependencies
        if (inputSteps.indexOf(dep.name) >= 0) {
          hasNoActiveDeps = false;
          continue;
        }
      }
    }

    // If step has no dependencies, move it to the output list and start
    // back at the first step remaining in the input list
    if (hasNoActiveDeps) {
      inputSteps.splice(inputSteps.indexOf(currStep.name), 1);
      outputSteps.push(currStep.name);
      i = 0;
    } else {
      i++;
    }
  }

  return outputSteps.join('');
}

function solvePart1(deps) {
  const inputSteps = Object.keys(deps);
  const outputSteps = [];
  let i = 0;
  
  while (inputSteps.length > 0) {
    const currStep = deps[inputSteps[i]];
    let hasNoActiveDeps = true;

    if (currStep.deps.length > 0) {
      for (let j = 0; j < currStep.deps.length; j++) {
        const dep = currStep.deps[j];

        // Move on to next step if current step has active dependencies
        if (inputSteps.indexOf(dep.name) >= 0) {
          hasNoActiveDeps = false;
          continue;
        }
      }
    }

    // If step has no dependencies, move it to the output list and start
    // back at the first step remaining in the input list
    if (hasNoActiveDeps) {
      inputSteps.splice(inputSteps.indexOf(currStep.name), 1);
      outputSteps.push(currStep.name);
      i = 0;
    } else {
      i++;
    }
  }

  return outputSteps.join('');
}

function solvePart2(deps, workerCount) {
  const inputSteps = Object.keys(deps);
  const workerTemplate = { task: '', time: 0 };
  let workers = new Array(workerCount).fill().map(_ => ({ ...workerTemplate }));

  let availableWorkerCount = workers.length;
  
  const _assignTasksToWorkers = () => {
    for (let i = 0; i < inputSteps.length; i++ ) {
      if (availableWorkerCount === 0) { return; }

      const currStep = deps[inputSteps[i]];
      let hasNoActiveDeps = true;

      if (currStep.deps.length > 0) {
        for (let j = 0; j < currStep.deps.length && hasNoActiveDeps; j++) {
          const dep = currStep.deps[j];

          // Move on to next step if current step has active dependencies
          if (inputSteps.indexOf(dep.name) >= 0) {
            hasNoActiveDeps = false;
          }
        }
      }

      // If step has no uncompleted dependencies, assign it to an available worker
      if (hasNoActiveDeps) {
        debugger;
        for (let w = 0; w < workers.length; w++) {
          if (!currStep.assigned && workers[w].task === '') { 
            currStep.assigned = true;
            workers[w].task = currStep.name;
            workers[w].time = currStep.time;
            availableWorkerCount--;
            break;
          }
        }
      }
    }
  }

  _isWorkDone = () => {
    return workers.reduce((acc, worker) => {
      return worker.time > 0 ? false : acc;
    }, true);
  }

  let time = 0;

  while (inputSteps.length > 0 || (inputSteps.length === 0 &&_isWorkDone === false)) {
    if (availableWorkerCount > 0) { _assignTasksToWorkers(); }
    
    const minTimeLeft = workers.reduce((acc, curr) => {
      return (acc === 0 || (curr.time > 0 && curr.time < acc)) ? curr.time : acc;
    }, 0)

    workers.forEach(({ task, time }, i) => {
      const newTime = time - minTimeLeft > 0 ? time - minTimeLeft : 0;
      workers[i].time = newTime;

      if (newTime === 0 && task !== '') { 
        inputSteps.splice(inputSteps.indexOf(task), 1);
        workers[i].task = '';
        availableWorkerCount++; 
        
      }
    });

    time = time + minTimeLeft;
  }

  return time;
}
