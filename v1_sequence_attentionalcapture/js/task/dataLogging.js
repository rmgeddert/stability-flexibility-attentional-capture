// data logging for sections
// instructions, break screens, etc
function logSectionData(){
  data.push([expStage, sectionType, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, sectionStart, sectionEnd, sectionEnd - sectionStart]);
  console.log(data);
}

function logAdditionalSingletonTask(){
  data.push([expStage, sectionType, block])
  console.log(data)
}
