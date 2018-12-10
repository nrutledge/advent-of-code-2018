require('pretty-error').start();
const getInputData = require('./utils/getInputData');
const inputToStrings = require('./utils/inputToStrings');

// Solves the challenge at: https://adventofcode.com/2018/day/7
getInputData.fromFile('../inputData/day7.txt')
  .then(input => {
    const instructions = inputToStrings(input);
    const steps = createStepsGraph(instructions);
    console.log('Answer1', findStepSequence(steps));
  })
  .catch(err => console.log(err));

  function parseInstruction(instruction) {
    const step = instruction.substring(5,6);
    const next = instruction.substring(36, 37);

    return { step, next };
  }

  // Create a graph of connected steps and dependencies
  function createStepsGraph(instructions) {
    const steps = {};

    instructions.forEach(instruction => {
      const { step, next } = parseInstruction(instruction);

      // Add next steps to graph if they don't already exist
      if (!steps[next]) { 
        steps[next] = ({ name: next, deps: [], next: [] }); 
      }

      // Add current step to graph if it doesn't already exist
      if (!steps[step]) {
        steps[step] = ({ name: step, deps: [], next: [steps[next]] });
      } else {
        // Connect step to next step
        steps[step].next.push(steps[next]);
      }
      // Connect next step back to current step
      steps[next].deps.push(steps[step]);
    });
  
    return steps;
  }

  function findStepSequence(steps) {
    const stepsWithNoDependencies = Object.values(steps)
      .sort(alphaSort)
      .filter(step => step.deps.length === 0);

    const _findSequence = (nextSteps, sequence = []) => {
      if (nextSteps.length === 0) { return sequence; }

      // Get ordered list of next steps that are not yet completed
      const sortedNextSteps = nextSteps.sort(alphaSort).filter(step => {
          return sequence.indexOf(step) >= 0 ? false : true;
      });

      // Set first available step with all dependencies completed (or no dependencies) 
      // as current step
      const currStep = sortedNextSteps.find(step => {
        if (step.deps.length > 0) {
          return step.deps.reduce((acc, dep) => {
            return sequence.indexOf(dep.name) === -1 ? false : acc;
          }, true);
        } else {
          return true;
        }
      });

      currStepIndex = sortedNextSteps.map(step => step.name).indexOf(currStep.name);

      // Remove current step from set of next steps and add it's next steps 
      // that were dependent on it's completion
      const newNextSteps = [
        ...new Set([
          ...sortedNextSteps.slice(0, currStepIndex), 
          ...sortedNextSteps.slice(currStepIndex + 1), 
          ...currStep.next
        ])
      ];
      const newSequence = [...sequence, currStep.name];

      return _findSequence(newNextSteps, newSequence);
    }

    return [...new Set(_findSequence(stepsWithNoDependencies))].join('');
  }

  function alphaSort(a, b) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  }
