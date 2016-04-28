// In Modle Fromula questions, changes 'One possible correct answer is' to 'The correct answer is'

window.onload = function() {
  var x = document.getElementsByClassName("formulaspartcorrectanswer");
  if (x.length > 0) {
    for (i = 0; i < x.length; i++) {
      x[i].innerHTML = x[i].innerHTML.replace("One possible ", "The ");
    }
  }
}
