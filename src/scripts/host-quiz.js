const quiz = require('./quiz');
const snackbar = require('./snackbar');
const MDCChipSet = require('@material/chips').MDCChipSet;

function makeId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function run(deck) {
  const joinedPlayersChipSet = document.querySelector('#joined__players-chip-set');
  const chipSet = new MDCChipSet(joinedPlayersChipSet);
  const cancelButton = document.querySelector('#host__cancel-button');
  const startButton = document.querySelector('#host__start-button');
  cancelButtonListener = () => {
    deck.slide(4);
  };
  cancelButton.addEventListener('click', () => {
    cancelButtonListener();
  });
  startButton.addEventListener('click', () => {
    startButtonListener();
  });
}

let cancelButtonListener = () => {};
let startButtonListener = () => {};

function refreshHostedQuiz(quizId, deck) {
  if (firebase.auth().currentUser) {
    const db = firebase.firestore();
    quiz.getQuizByQuizId(firebase.auth().currentUser.uid, quizId).then((doc) => {
      if (doc.exists && !doc.data()['deleted']) {
        const gameId = makeId(6);
        db.collection('hosted-quiz').doc(gameId).set({
          'active': true,
          'started': false,
          'questions': doc.data()['questionsToInsert'],
          'activeQuestion': {
            'index': -1,
            'timedOut': true
          }
        }).then(() => {
          const gamePin = document.querySelector('#game__pin');
          gamePin.innerHTML = gameId;
          const unsubscribeDocRef = db.collection('hosted-quiz').doc(gameId).collection('user').onSnapshot((querySnapshot) => {
            const joinedPlayersCount = document.querySelector('#joined__players-count');
            const joinedPlayersChipSet = document.querySelector('#joined__players-chip-set');
            const startButton = document.querySelector('#host__start-button');
            joinedPlayersCount.innerHTML = querySnapshot.size;
            joinedPlayersChipSet.innerHTML = '';
            if (querySnapshot.size) {
              startButton.disabled = false;
              querySnapshot.forEach((doc) => {
                const mdcChip = document.createElement('div');
                mdcChip.innerHTML = `
                  <div class="mdc-chip__ripple"></div>
                  <span role="gridcell">
                    <span role="button" tabindex="0" class="mdc-chip__primary-action">
                      <span class="mdc-chip__text">${doc.data()['name']}</span>
                    </span>
                  </span>`;
                mdcChip.setAttribute('title', 'Remove Player');
                mdcChip.classList.add('mdc-chip');
                mdcChip.classList.add('player');
                mdcChip.addEventListener('click', () => {
                  db.collection('hosted-quiz').doc(gameId).collection('user').doc(doc.id).remove();
                });
                joinedPlayersChipSet.append(mdcChip);
              })
            } else {
              startButton.disabled = true;
              joinedPlayersChipSet.innerHTML = `<div class="mdc-chip" role="row">
                <div class="mdc-chip__ripple"></div>
                  <span role="gridcell">
                    <span role="button" tabindex="0" class="mdc-chip__primary-action">
                      <span class="mdc-chip__text">Waiting for players...</span>
                    </span>
                  </span>
                </div>`;
            }
          })
          cancelButtonListener = () => {
            if (unsubscribeDocRef) {
              db.collection('hosted-quiz').doc(gameId).update({
                'active': false
              }).then(() => {
                unsubscribeDocRef();
                deck.slide(4);
              });
            } else {
              deck.slide(4);
            }
          }
          deck.slide(8);
        });
      } else {
        snackbar.openSnackbarMessage('Quiz does not exists.', 'danger');
        deck.slide(4);
      }
    });
  } else {
    deck.slide(0);
  }
}

module.exports = {
  run: run,
  refreshHostedQuiz: refreshHostedQuiz
}
