function run(deck) {
  const createButton = document.querySelector('#list__create-button');
  createButton.addEventListener('click', () => {
    deck.slide(3);
  });
  initQuizList(deck);
}
function initQuizList(deck) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      const docRef = firebase.firestore().collection('users').doc(user.uid).collection('quiz');
      docRef.onSnapshot(function(querySnapshot) {
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
                <td class="mdc-data-table__cell">${data['playsCount']}</td>
                <td class="mdc-data-table__cell text-center">
                  <button class="mdc-button mdc-button--raised" data-id="${doc.id}">
                    <span class="mdc-button__label">Host</span>
                  </button>
                </td>
                <td class="mdc-data-table__cell text-center">
                  <button class="mdc-button mdc-button--raised" data-id="${doc.id}">
                    <span class="mdc-button__label">Edit</span>
                  </button>
                </td>
              </tr>`;
            quizListBody.append(tr);
            i++;
          })
        } else {
          quizListBody.innerHTML = `
            <tr class="mdc-data-table__row">
              <td class="mdc-data-table__cell" colspan="6">No data.</td>
            </tr>`;
        }
      });
    } else {
      deck.slide(0);
    }
  });
}

module.exports = {
    run: run
};