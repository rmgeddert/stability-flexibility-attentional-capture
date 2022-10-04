
function runPractice(numPracticeTrials, task = null){
  trialCount = 0;
  if (repeatNecessary != true){
    block = 1;
  }

  // create task array for practice block
  createPracticeTaskArrays(numPracticeTrials, task);

  // start countdown into practice block
  countDown(3);
}

function createPracticeTaskArrays(nTrials, task){
  let taskSwitchCongruencyArr = buildPracticeTaskSequence(nTrials, task)
  taskStimuliSet = getStimSet(taskSwitchCongruencyArr);
  cuedTaskSet = getTaskSet(taskSwitchCongruencyArr, task);
  switchRepeatList = taskSwitchCongruencyArr.map(item => item[0])
  actionSet = createActionArray();
  sequenceTypeArr = taskSwitchCongruencyArr.map(item => item[2])
  sequenceKindArr = taskSwitchCongruencyArr.map(item => item[3])
  sequencePositionArr = taskSwitchCongruencyArr.map(item => item[4])
}

function createTaskArrays(){
  //first figure out sequence of switches, repeats, congruency, sequence vs filter trials
  let taskSwitchCongruencyArr;
  taskSwitchCongruencyArr = buildTaskSequence();

  // figure out which shape we are looking for
  taskStimuliSet = getStimSet(taskSwitchCongruencyArr);

  // figure out which task we need (no longer relevant)
  cuedTaskSet = getTaskSet(taskSwitchCongruencyArr);

  // get list of switches and repeats (just to have)
  switchRepeatList = taskSwitchCongruencyArr.map(item => item[0])

  //what button needs to be clicked on each trial (needs to be rewritten)
  actionSet = createActionArray();
  sequenceTypeArr = taskSwitchCongruencyArr.map(item => item[2])
  sequenceKindArr = taskSwitchCongruencyArr.map(item => item[3])
  sequencePositionArr = taskSwitchCongruencyArr.map(item => item[4])
}

function runPracticeTrial(){
  sectionType = "pracTask";
  if (trialCount < taskStimuliSet.length){
    if (expType == 3){ //check if key is being held down
      expType = 4;
      promptLetGo();
    } else {
      // check if screen size is big enough
      if (screenSizeIsOk()){
        // start next trial cycle
        fixationScreen();
      } else {
        promptScreenSize();
      }
    }
  } else { //if practice block is over, go to feedback screen
    practiceAccuracyFeedback( Math.round( accCount / (blockTrialCount) * 100 ) );
  }
}

function runTrial(){
  sectionType = "mainTask";

  // if experiment is over, go to end of experiment
  if (trialCount >= nBlocks * trialsPerBlock) {
    endOfExperiment();
    return;
  }

  // if block break, go to block break (or miniblock break)
  if (trialCount % trialsPerBlock == 0 && !breakOn && trialCount != 0) {
    breakOn = true;
    bigBlockScreen();
    return;
  } else if (trialCount % miniBlockLength == 0 && !breakOn && trialCount != 0) {
    breakOn = true;
    miniBlockScreen();
    return;
  }

  // person is still holding down key from previous trial, tell them to let go
  if (expType == 3 || expType == 5){
    expType = 4;
    promptLetGo();
    return;
  }

  // if they minimized the screen, tell them its too small.
  if (!screenSizeIsOk()){
    promptScreenSize();
    return;
  }

  // none of the above happened, proceed to trial
  breakOn = false;
  fixationScreen();
}

function fixationScreen(){
  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 85px Arial";
  ctx.fillStyle = "black";

  // display fixation
  ctx.fillText("+",canvas.width/2,canvas.height/2);

  // go to next after appropriate time
  setTimeout(stimScreen, fixInterval);
}

function stimScreen(){
  if (expType == 5) {

    expType = 6;
    promptLetGo();

  } else {

    stimOnset = new Date().getTime() - runStart;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw rectangle cue
    // ....

    //reset all response variables and await response (expType = 1)
    expType = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;

    // display stimulus
    //....

    // proceed to ITI screen after timeout
    stimTimeout = setTimeout(itiScreen,stimInterval);
  }
}

function itiScreen(){
  if (keyListener == 1) { // participant didn't respond
    keyListener = 0;
  } else if (keyListener == 2) { //participant still holding down response key
    keyListener = 3;
  }

  // log data
  logAdditionalSingletonTask();

  // display feedback
  prepareCanvas("bold 80px Arial", "black", true);
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);

  // trial finished. iterate and proceed to next
  this.trialCount++; this.blockTrialCount++;
  setTimeout(this.trialFunc, this.itiFunc());
}


class AdditionalSingletonTask{
  constructor(){
    // task parameters


    this.shape1 = (taskMapping == 1) ? "d" : "c";
    this.shape2 = (taskMapping == 1) ? "c" : "d";
  }

  createTaskArrays(){
    //create task arrays and put them into global task arrays

    // see taskSequenceGeneration.js for code
    let mainTaskArr = this.buildTaskArray();

    // // figure out which shape we are looking for
    // taskStimuliSet = getStimSet(taskSwitchCongruencyArr);
    //
    // // figure out which task we need (no longer relevant)
    // cuedTaskSet = getTaskSet(taskSwitchCongruencyArr);
    //
    // // get list of switches and repeats (just to have)
    // switchRepeatList = taskSwitchCongruencyArr.map(item => item[0])
    //
    // //what button needs to be clicked on each trial (needs to be rewritten)
    // actionSet = createActionArray();
    // sequenceTypeArr = taskSwitchCongruencyArr.map(item => item[2])
    // sequenceKindArr = taskSwitchCongruencyArr.map(item => item[3])
    // sequencePositionArr = taskSwitchCongruencyArr.map(item => item[4])
  }



    // function checkArray(arr){
    //   //make sure array is balanced
    //   let type1Trials = blockTaskArr.filter(trial => trial == "m").length;
    //   let nRangeMagnitude = 0;
    //   if (nMagTrials < (trialsPerBlock / 2) - nRangeMagnitude || nMagTrials > (trialsPerBlock / 2) + nRangeMagnitude ) {
    //     return true;
    //   }
    //
    //   return false;
    // }


}
