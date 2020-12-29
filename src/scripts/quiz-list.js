const quiz = require('./quiz');
const MDCDialog = require('@material/dialog').MDCDialog;
const MDCSnackbar = require('@material/snackbar').MDCSnackbar;
let quizDeleteDialog, snackbar, snackbarRoot;

function run(deck, signOutCallback) {
  const createButton = document.querySelector('#list__create-button');
  const logoutButton = document.querySelector('#list__logout-button');
  quizDeleteDialog = new MDCDialog(document.querySelector('#quiz__delete-dialog'));
  snackbarRoot = document.querySelector('.mdc-snackbar');
  snackbar = new MDCSnackbar(snackbarRoot);
  createButton.addEventListener('click', () => {
    deck.slide(3);
  });
  logoutButton.addEventListener('click', () => {
    signOutCallback(deck);
  });
  initQuizList(deck);
  snackbar.listen('MDCSnackbar:closed', () => {
    const snackbarText = document.querySelector('.mdc-snackbar .mdc-snackbar__label');
    snackbarText.innerText = '-';
    snackbarRoot.classList.remove('snackbar-success');
    snackbarRoot.classList.remove('snackbar-danger');
  });
}

function openSnackbarMessage(message, status) {
  const snackbarText = document.querySelector('.mdc-snackbar .mdc-snackbar__label');
  snackbarText.innerText = message;
  snackbarRoot.classList.add(`snackbar-${status}`);
  snackbar.open();
}

function refreshQuizList(querySnapshot) {
  const quizListBody = document.getElementById('quiz-list-body');
  quizListBody.innerHTML = "";
  if (querySnapshot.size) {
    let i = 1;
    querySnapshot.forEach((doc) => {
      const tr = document.createElement('tr');
      const data = doc.data();
      tr.innerHTML = `
        <tr class="mdc-data-table__row">
          <th class="mdc-data-table__cell" scope="row">#${i}</th>
          <td class="mdc-data-table__cell">${data['title']}</td>
          <td class="mdc-data-table__cell">${data['description']}</td>
          <td class="mdc-data-table__cell text-center">${data['playsCount']}</td>
          <td class="mdc-data-table__cell text-center">
            <button class="mdc-button mdc-button--raised" data-id="${doc.id}">
              <span class="mdc-button__label">Host</span>
            </button>
          </td>
          <td class="mdc-data-table__cell text-center">
            <button class="mdc-button mdc-button--raised" data-id="${doc.id}">
              <i class="material-icons mdc-button__icon" aria-hidden="true">edit</i>
            </button>
            <button class="list__delete-button mdc-button mdc-button--raised" data-id="${doc.id}" data-title="${data['title']}">
              <i class="material-icons mdc-button__icon" aria-hidden="true">delete</i>
            </button>
          </td>
        </tr>`;
      quizListBody.append(tr);
      i++;
    })
    const allDeleteButton = document.querySelectorAll('.list__delete-button');
    allDeleteButton.forEach((element) => {
      element.addEventListener('click', () => {
        const quizDeleteTitle = document.querySelector('#quiz__delete-title');
        quizDeleteTitle.innerHTML = element.dataset.title;
        quizDeleteDialog.listen('MDCDialog:closing', function() {
          if (firebase.auth().currentUser) {
            quiz.deleteQuiz(firebase.auth().currentUser.uid, element.dataset.id)
              .then(() => {
                openSnackbarMessage('Quiz deleted successfully.', 'success');
              })
              .catch((error) => {
                console.log(error);
                openSnackbarMessage('Quiz failed to be deleted.', 'danger');
              });
          }
        });
        quizDeleteDialog.open();
        
        
      });
    });
  } else {
    quizListBody.innerHTML = `
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell" colspan="6">No data.</td>
      </tr>`;
  }
}

function initQuizList(deck) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      quiz.getQuiz(user.uid, refreshQuizList);
    } else {
      deck.slide(0);
    }
  });
}

module.exports = {
    run: run
};