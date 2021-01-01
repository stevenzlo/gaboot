const quiz = require('./quiz');
// const MDCChipSet = require('@material/chips').MDCChipSet;

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function run() {
  // const chipSetEl = document.querySelector('#host-quiz .mdc-chip-set');
  // const chipSet = new MDCChipSet(chipSetEl);
  
}

function refreshHostedQuiz(quizId, deck) {
  if (firebase.auth().currentUser) {
    quiz.getQuizByQuizId(firebase.auth().currentUser.uid, quizId).then((doc) => {
      if (doc.exists && !doc.data()['deleted']) {

      } else {
        deck.slide(4);
      }
    });
  } else {
    deck.slide(0);
  }
}

module.exports = {
  run: run
}
