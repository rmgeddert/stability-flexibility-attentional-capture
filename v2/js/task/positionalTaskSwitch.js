function positionalTaskSwitch(){
  hideInstructions();
  canvas.style.display = "inline-block";
  $(".canvasas").show();
  canvas.style.border = 'solid'
  ctx.fillStyle = "#DCDCDC";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.body.style.backgroundColor = "#DCDCDC"

  horz_offset = 180
  vert_offset = 210
  circle_rad = 50
  target_loc = "NE"
  distractor_loc = "SW"
  third_loc = "S"

  let stimuli = [1,2,3,4,6,7,8,9]

  let positions = {
    "N": [canvas.width/2, canvas.height/2 - vert_offset, circle_rad],
    "NE": [canvas.width/2 - horz_offset, canvas.height/2 - vert_offset/2, circle_rad],
    "NW": [canvas.width/2 + horz_offset, canvas.height/2 - vert_offset/2, circle_rad],
    "SE": [canvas.width/2 - horz_offset, canvas.height/2 + vert_offset/2, circle_rad],
    "SW": [canvas.width/2 + horz_offset, canvas.height/2 + vert_offset/2, circle_rad],
    "S": [canvas.width/2, canvas.height/2 + vert_offset, circle_rad]
  }

  // for (var [key, value] of Object.entries(positions)) {
  //   // drawCircle(...value)
  //   if (key == target_loc) {
  //     defaultStyle()
  //     // drawSquare(...value)
  //     drawHexagon(...value)
  //     drawStim(...value, 6)
  //   } else if (key == distractor_loc) {
  //     ctx.strokeStyle = 'red'
  //     ctx.lineWidth = 4
  //     drawCircle(...value)
  //     drawStim(...value, _.sample(stimuli))
  //   } else {
  //     defaultStyle()
  //     drawCircle(...value)
  //     drawStim(...value, _.sample(stimuli))
  //   }
  // }

  drawHexagon(canvas.width/2, canvas.height/2, circle_rad)
  drawStim(canvas.width/2, canvas.height/2, circle_rad, 6)

  ctx.strokeStyle = 'red'
  ctx.lineWidth = 4
  drawCircle(...positions.NE)
}

function drawCircle(x, y, radius){
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawSquare(x, y, radius){
  // width = average width of circumsribed circle/square and vice versa
  let width = ((2 * radius / Math.sqrt(2)) + radius * 2) / 2
  ctx.rect(x - width/2, y - width/2, width,  width)
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

function defaultStyle(){
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
}

function drawStim(x, y, radius, target){
  ctx.font = '45px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText(target, x, y + 5)
}



// function drawSquare1(x, y, halfWidth){
//   // square circumscribed by circle
//   ctx.rect(x - halfWidth, y - halfWidth, halfWidth*2,  halfWidth*2)
//   ctx.stroke();
// }
//
// function drawSquare2(x, y, halfDiagonal){
//   // square circumscribed about circle
//   let width = 2 * halfDiagonal / Math.sqrt(2)
//   ctx.rect(x - width/2, y - width/2, width,  width)
//   ctx.stroke();
// }
