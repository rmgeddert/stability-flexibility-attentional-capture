function attentionalSingletonTask(){
  console.log("attentionalSingletonTask");
  // prepare for task
  hideInstructions();
  showCanvas();
  hideCursor();
  changeScreenBackgroundTo("lightgrey");

  taskFunc = attentionalSingletonTrial;
  transitionFunc = itiScreen;

  //create task arrays
  buildTaskArray();

  // start task after countdown
  countDown(3);
}

function attentionalSingletonTrial(){
    // change global variables
    sectionType = "mainTask";
    taskName = "additionalSingletonTask";

    // if experiment is over, go to end of experiment
    if (trialCount >= nBlocks * trialsPerBlock) {
      experimentFlow();
      return;
    }

    // if block break, go to block break
    if (trialCount % trialsPerBlock == 0 && !breakOn && trialCount != 0) {
      breakOn = true;
      bigBlockScreen();
      return;
    }

    // person is still holding down key from previous trial, tell them to let go
    if (keyListener == 3){
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
  prepareCanvas("85px Arial", "black", true);
  ctx.fillText("+",canvas.width/2,canvas.height/2);
  setTimeout(stimScreen, fixInterval);
}

function stimScreen(){
  stimOnset = new Date().getTime() - runStart;
  prepareCanvas("45px Arial", "black", true)

  //start drawing here
  drawStimGrid()

  keyListener = 1; acc = NaN, respTime = NaN, partResp = NaN, respOnset = NaN;
  stimTimeout = setTimeout(itiScreen,stimInterval);
}

function drawStimGrid(){
  let horz_offset = 180
  let vert_offset = 210
  let circle_rad = 50

  let positions = {
    1: [canvas.width/2, canvas.height/2 - vert_offset, circle_rad],
    2: [canvas.width/2 - horz_offset, canvas.height/2 - vert_offset/2, circle_rad],
    3: [canvas.width/2 + horz_offset, canvas.height/2 - vert_offset/2, circle_rad],
    4: [canvas.width/2 - horz_offset, canvas.height/2 + vert_offset/2, circle_rad],
    5: [canvas.width/2 + horz_offset, canvas.height/2 + vert_offset/2, circle_rad],
    6: [canvas.width/2, canvas.height/2 + vert_offset, circle_rad]
  }

  let targetShape = targetShapeArr[trialCount - 1];
  let nonTargetShape = shapeSwitcher[targetShape];

  for (let [key, coords] of Object.entries(positions)) {

    // if target, draw target and continue
    if (key == targetLocationArr[trialCount - 1]) {
      // console.log("Drawing as target, key: " + key);
      // console.log(coords);
      defaultStyle();
      drawShape(targetShape, coords);
      drawStim(...coords, "/")
      continue;
    }

    // if distractor, draw but red
    if (distractionArr[trialCount - 1] == "d") {
      if (key == distractorLocationArr[trialCount - 1]) {
        ctx.strokeStyle = 'red'
        ctx.lineWidth = 4
        drawShape(nonTargetShape, coords);
        drawStim(...coords, "/")
        continue;
      }
    }

    // if neither (or no distractor), draw non target shape
    defaultStyle()
    drawShape(nonTargetShape, coords);
    drawStim(...coords, "\\")
  }
}

function drawShape(shape, coords){
  if (shape == 'c'){
    drawCircle(...coords);
  } else if (shape == 's'){
    drawSquare(...coords);
  } else if (shape == 'h') {
    drawHexagon(...coords);
  }
}

function drawSquare(x, y, radius){
  // width = average width of circumsribed circle/square and vice versa
  let width = ((2 * radius / Math.sqrt(2)) + radius * 2) / 2
  ctx.beginPath();
  ctx.rect(x - width/2, y - width/2, width,  width)
  ctx.closePath();
  ctx.stroke();
}

function drawHexagon(x, y, radius){
  // includes +10%radius adjustment
  let a = 2 * Math.PI / 6;
  ctx.beginPath();
  for (var i = 0; i < 6; i++) {
    ctx.lineTo(x + (radius * 1.1) * Math.cos(a * i), y + (radius * 1.1) * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.stroke();
}

function drawCircle(x, y, radius){
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function defaultStyle(){
  prepareCanvas("45px Arial", "black", false)
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
}

function drawStim(x, y, radius, target){
  ctx.font = '45px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText(target, x, y + 5)
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
  prepareCanvas("80px Arial", "black", true);
  ctx.fillText(accFeedback(),canvas.width/2,canvas.height/2);

  // trial finished. iterate and proceed to next
  trialCount++; blockTrialCount++;
  setTimeout(taskFunc, itiInterval(1200, 1400, 50));
}

function buildTaskArray(){
  //create order of inserted sequences (nSequenceTypes * nSequenceReps many)
  let sequenceOrderArr = shuffle(new Array(nSequenceReps).fill(_.range(1, nSequenceTypes + 1)).flat());

  // for each block in block order, create a block of trials based on above sequence order (sequence order is the same for each block).
  // repeat making block array until it has exactly 50% of each target stimulus
  let taskArray = [];
  let targetShapes = []
  blockOrder.forEach(blockLetter => {
    let blockArr, blockTaskArr;
    do {
      blockArr = buildBlockArr(sequenceOrderArr, blockLetter);
      blockTargetArr = getTargetArr(blockArr);
    } while (!equalCounts(blockTargetArr));
    taskArray = taskArray.concat(blockArr);
    targetShapes = targetShapes.concat(blockTargetArr);
  });

  // split final task array into its constituent parts (just for ease of use later)
  switchRepeatArr = taskArray.map(arr => arr[0]);
  distractionArr = taskArray.map(arr => arr[1]);
  sequenceTypeArr = taskArray.map(arr => arr[2]);
  sequenceKindArr = taskArray.map(arr => arr[3]);
  sequencePositionArr = taskArray.map(arr => arr[4]);
  targetShapeArr = targetShapes;

  // figure out at which of 6 locations the target will appear on each trial, do it in block batches so each block is closer to perfectly 50/50. Also figure out distractor in same step
  for (let i = 0; i < nBlocks; i++) {
    let locArr = buildTargetLocationArr();
    targetLocationArr = targetLocationArr.concat(locArr);
    distractorLocationArr = distractorLocationArr.concat(buildDistractorLocationArr(locArr));
  }

  // figure out which arrow will appear for the target on each trial, do it in block batches so each block is closer to perfectly 50/50
  for (let i = 0; i < nBlocks; i++) {
    arrowDirectionArr = arrowDirectionArr.concat(buildArrowDirectionArray());
  }
}

function buildDistractorLocationArr(targetArr){
  return targetArr.map(n => _.sample(_.range(1,nLocations + 1).filter(m => m != n)));
}

function buildTargetLocationArr(){
  let locationArr = new Array(Math.floor(trialsPerBlock/nLocations)).fill(_.range(1,nLocations + 1)).flat();
  locationArr = locationArr.concat(_.range(1, (trialsPerBlock % nLocations)+1));
  return shuffle(locationArr);
}

function buildArrowDirectionArray(){
  let arrowArr = new Array(Math.floor(trialsPerBlock/2)).fill("l");
  arrowArr = arrowArr.concat(new Array(trialsPerBlock - arrowArr.length).fill("r"));
  return shuffle(arrowArr);
}

function buildBlockArr(seqOrder, blockType){
  // get filler order of n sequences + 1
  let nFillerBlocks = nSequenceTypes * nSequenceReps + 1;

  // figure out how long each filler block is (stretch of fillers between sequences)
  let fillers = new Array(nFillerBlocks).fill(minFillerLength);
  let remainingFillers = nFillers - (fillers.length * minFillerLength)
  while (remainingFillers > 0) {
    let randIdx = Math.floor(Math.random() * fillers.length)
    if (fillers[randIdx] == maxFillerLength) {
      continue;
    } else {
      fillers[randIdx] = fillers[randIdx] + 1;
      remainingFillers--;
    }
  }

  // get sequence flips
  let sequenceFlips = shuffle(new Array(nSequenceFlips).fill('f').concat(new Array(nSequenceNotFlips).fill('n')));

  //build final task array of sequences and fillers
  let blockArr = [];
  // for each filler block
  for (let i = 0; i < nFillerBlocks; i++) {

    // first add all the filler trials
    for (let j = 0; j < fillers[i]; j++) {
      // add each filler trials for that block type
      if (i == 0 && j == 0) {
        blockArr = blockArr.concat([['n', blockTypeFillers[blockType][1], blockTypeFillers[blockType][2], NaN, NaN]])
      } else {
        blockArr = blockArr.concat([blockTypeFillers[blockType]])
      }
    }

    if (i == nFillerBlocks - 1) {
      break;
    }

    // next add the sequence (except last iteration)
    blockArr = blockArr.concat(taskSequences[seqOrder[i]]);

    // finally add the random 50/50 sequence flipper
    if (sequenceFlips[i] == 'n') {
      blockArr = blockArr.concat([blockTypeFillers[blockType]]);
    } else {
      blockArr = blockArr.concat([blockTypeFillers[flipBlockType[blockType]]]);
    }
  }

  return blockArr;
}

function getTargetArr(blockArr){
  let targetsArr = [];

  // fill targetsArr
  for (let i = 0; i < blockArr.length; i++) {
    // if first in block, randomly pick shape1 or 2
    if (i == 0) {
      targetsArr.push((Math.random() > 0.5) ? shape1 : shape2);
      continue;
    }

    // if repeat use same shape, if switch use shapeSwitcher
    if (blockArr[i][0] == "r") {
      targetsArr.push(targetsArr[i - 1]);
    } else {
      targetsArr.push(shapeSwitcher[targetsArr[i - 1]]);
    }
  }

  return targetsArr;
}
