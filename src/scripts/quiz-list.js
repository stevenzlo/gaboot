function run(deck) {
  const createButton = document.querySelector('#list__create-button');
  createButton.addEventListener('click', () => {
    deck.slide(3);
  });
  initQuizList();
}
function initQuizList() {
  console.log(firebase.auth().currentUser.uid);
  const docRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
  docRef.get().then(function(doc) {
    const quizListBody = document.getElementById('quiz-list-body');
    quizListBody.innerHTML = "";
    if (doc.exists) {
      console.log(doc.data());
    } else {
      quizListBody.innerHTML = `
        <tr class="mdc-data-table__row">
          <td class="mdc-data-table__cell" colspan="6">No data.</td>
        </tr>`;
    }
  })
}

module.exports = {
    run: run
};