
function getTargetShapes(switchCongruencyArr){
  let targetsArr = [];
  for (let i = 0; i < switchCongruencyArr.length; i++) {
    console.log(switchCongruencyArr[i]);
  }
  return targetsArr;
}

function createActionArray(){
  let responseMappings = {
    1: {
      odd : [90,122],
      even : [77,109],
      larger : [90,122],
      smaller : [77,109]
    },
    2: {
      odd : [90,122],
      even : [77,109],
      larger : [77,109],
      smaller : [90,122]
    },
    3: {
      odd : [77,109],
      even : [90,122],
      larger : [90,122],
      smaller : [77,109]
    },
    4: {
      odd : [77,109],
      even : [90,122],
      larger : [77,109],
      smaller : [90,122]
    }
  };

  // for each stimulus and associated task, identify required action for correct response
  let actionArr = [];
  taskStimuliSet.forEach(function(taskStim, index){
    let task = cuedTaskSet[index];
    actionArr.push(responseMappings[taskMapping][getCategory(taskStim, task)]);
  })
  return actionArr;
}

function getCategory(number, task){
  if (task == "m") {
    if (number < 5) {
      return "smaller";
    } else {
      return "larger";
    }
  } else {
    if (number%2 == 0) {
      return "even";
    } else {
      return "odd";
    }
  }
}

function buildPracticeTaskSequence(nTrials, task = null){
  let practiceSequences;
  if (task == null) {
    practiceSequences = {
      1: ['r', 'c', NaN, NaN, NaN],
      2: ['r', 'i', NaN, NaN, NaN],
      3: ['s', 'c', NaN, NaN, NaN],
      4: ['s', 'i', NaN, NaN, NaN]
    }
  } else {
    practiceSequences = {
      1: ['r', 'c', NaN, NaN, NaN],
      2: ['r', 'i', NaN, NaN, NaN]
    }
  }

  let nSequences = Math.ceil(nTrials / Object.keys(practiceSequences).length);
  let sequenceOrder = shuffle(new Array(nSequences).fill(Object.keys(practiceSequences)).flat());

  let taskArr = []
  for (let i = 0; i < sequenceOrder.length; i++) {
    if (i == 0) {
      taskArr.push(['n', (Math.random() > 0.5) ? 'c' : 'i', NaN, NaN, NaN])
    } else {
      taskArr.push(practiceSequences[sequenceOrder[i]])
    }
  }

  return taskArr.splice(0, nTrials);
}
