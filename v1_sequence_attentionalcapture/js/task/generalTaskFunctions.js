function accFeedback(){
  if (acc == 1){
    return "Correct";
  } else if (acc == 0) {
    return "Incorrect";
  } else {
    return "Too Slow";
  }
}

function accFeedbackColor(){
  if (acc == 1){
    return "green";
  } else if (acc == 0) {
    return "red";
  } else {
    return "black";
  }
}

function itiInterval(min, max, jitter){
  // creates random ITI interval in range from min to max (inclusive) with step size jitter
  let itiMin = (speed == "fast") ? 20 : min; //1200
  let itiMax = (speed == "fast") ? 20 : max; //1400
  let itiStep = jitter; //step size
  // random number between itiMin and Max by step size
  return itiMin + (Math.floor( Math.random() * ( Math.floor( (itiMax - itiMin) / itiStep ) + 1 ) ) * itiStep);
}

function countDown(seconds){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 80px Arial";
  if (seconds > 0){
    ctx.fillText(seconds,canvas.width/2,canvas.height/2)
    setTimeout(function(){countDown(seconds - 1)},1000);
  } else {
    taskFunc();
  }
}

function bigBlockScreen(){
  // block break with countdown so they don't pause too long
  let minutesBreak = 2;
  sectionType = "blockBreak";
  sectionStart = new Date().getTime() - runStart;
  keyListener = 0;
  setTimeout(function(){keyListener = 7},1000);

  // display break screen (With timer)
  drawBreakScreen("0" + minutesBreak,"00", minutesBreak);
  blockBreakFunction(minutesBreak,0,minutesBreak);

  function blockBreakFunction(minutes, seconds, max){
    let time = minutes*60 + seconds;
    ctx.fillStyle = "black";
    sectionTimer = setInterval(function(){
      if (time < 0) {return}
      ctx.fillStyle = (time <= 60) ? "red" : "black";
      let minutes = Math.floor(time / 60);
      if (minutes < 10) minutes = "0" + minutes;
      let seconds = Math.floor(time % 60);
      if (seconds < 10) seconds = "0" + seconds;
      drawBreakScreen(minutes, seconds, max);
      time--;
    }, 1000);
  }
}

function drawBreakScreen(minutes, seconds, max){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw timer (with color from previous function)
  ctx.font = "bold 45px Arial";
  ctx.fillText(minutes + ":" + seconds,canvas.width/2,canvas.height/2 - 100);

  // display miniblock text
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  ctx.fillText("This is a short break. Please don't pause for more than " + max + " minutes.",canvas.width/2,canvas.height/2 - 150);
  if (nBlocks - block > 1) {
    ctx.fillText("You are finished with block " + block + ". You have " + (nBlocks - block) + " blocks left.",canvas.width/2,canvas.height/2);
  } else {
    ctx.fillText("You are finished with block " + block + ". You have " + (nBlocks - block) + " block left.",canvas.width/2,canvas.height/2);
  }
  ctx.fillText("Your overall accuracy so far is " + Math.round((accCount/trialCount)*100) + "%.",canvas.width/2,canvas.height/2+50);
  ctx.font = "bold 25px Arial";
  ctx.fillText("Press any button to continue.",canvas.width/2,canvas.height/2 + 200);
}

function practiceAccuracyFeedback(accuracy){
  sectionStart = new Date().getTime() - runStart;
  sectionType = "pracFeedback";

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";
  // keyListener = 11; CHANGE ME

  // display feedback
  if (accuracy < practiceAccCutoff) { //if accuracy is too low
    repeatNecessary = true;

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Remember, you need to get >" + practiceAccCutoff + "%.",canvas.width/2,canvas.height/2);
    ctx.fillText("Press any button to go back ",canvas.width/2,canvas.height/2 + 80);
    ctx.fillText("to the instructions and try again.",canvas.width/2,canvas.height/2 + 110);

  } else { //otherwise proceed to next section

    // display feedback text
    ctx.fillText("You got " + accuracy + "% correct in this practice block.",canvas.width/2,canvas.height/2 - 50);
    ctx.fillText("Press any button to go on to the next section.",canvas.width/2,canvas.height/2 + 100);

    // prep key press/instruction logic
    repeatNecessary = false;

  }
}

function getAccuracy(accValue){
  //normalizes accuracy values into 0 or 1 (NaN becomes 0)
  return accValue == 1 ? 1 : 0;
}

function promptLetGo(){
  //prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";

  // show warning
  ctx.fillText("Please release key",canvas.width/2,canvas.height/2);
  ctx.fillText("immediately after responding.",canvas.width/2,canvas.height/2 + 30);
}

function screenSizeIsOk(){
  // attempts to check window width and height, using first base JS then jquery.
  // if both fail, returns TRUE
  let w, h, minWidth = 800, midHeight = 600;
  try {
    // base javascript
    w = window.innerWidth;
    h = window.innerHeight;
    if (w == null | h == null) {throw "window.innerWidth/innerHeight failed.";}
  } catch (err) {
    try{
      // jquery
      w = $(window).width();
      h = $(window).height();
      if (w == null | h == null) {throw "$(window).width/height failed.";}
    } catch (err2) {
      // failure mode, returns true if both screen checks failed
      return true;
    }
  }
  // return dimension check if values are defined
  return w >= minWidth && h >= midHeight;
};

function promptScreenSize(){
  // set key press experiment type
  expType = 10;

  // prepare canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
  ctx.font = "25px Arial";

  // allows up to two warnings before terminating experiment
  if (screenSizePromptCount < numScreenSizeWarnings) {
    screenSizePromptCount++;

    // display screen size prompt
    ctx.font = "25px Arial";
    ctx.fillText("Your screen is not full screen or the",canvas.width/2,canvas.height/2);
    ctx.fillText("screen size on your device is too small.",canvas.width/2,(canvas.height/2) + 40);
    ctx.fillText("If this issue persists, you will need",canvas.width/2,(canvas.height/2)+160);
    ctx.fillText("to restart the experiment and will ",canvas.width/2,(canvas.height/2)+200);
    ctx.fillText("not be paid for your previous time.",canvas.width/2,(canvas.height/2)+240);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please correct this and press any button to continue.",canvas.width/2,(canvas.height/2)+100);

  } else {

    // display screen size prompt
    ctx.fillText("Your screen is not full screen",canvas.width/2,canvas.height/2);
    ctx.fillText("or the screen size on your device is too small.",canvas.width/2,(canvas.height/2)+50);
    ctx.font = "bold 25px Arial";
    ctx.fillText("Please refresh the page to restart the experiment.",canvas.width/2,(canvas.height/2)+100);

  }
}
