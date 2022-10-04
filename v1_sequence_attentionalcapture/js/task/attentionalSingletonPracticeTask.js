function attentionalSingletonPracticeTask(){
  // set taskName for data logging
  taskName = "attentionalSingletonPracticeTask";
  nPracticeTrials = 8;

  // prepare for task
  hideInstructions();
  showCanvas();
  hideCursor();
  changeScreenBackgroundTo("lightgrey");

  // global variables for functions
  taskFunc = attentionalSingletonPracticeTrial;
  transitionFunc = itiScreen;
  stimFunc = buildLineDirectionPracticeTaskArray();

  //create task arrays
  drawStimGrid();

  // start task after countdown (calls taskFunc)
  countDown(3);
}

function attentionalSingletonPracticeTrial(){

    // (re)set sectionType (might have been changed to block break)
    sectionType = "practiceTask";

    // if task is over, proceed back to next instruction
    if (trialCount >= nPracticeTrials) {
      navigateInstructionPath();
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
