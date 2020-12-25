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
      const docRef = firebase.firestore().collection("users").doc(user.uid);
      docRef.onSnapshot(function(doc) {
        const quizListBody = document.getElementById('quiz-list-body');
        quizListBody.innerHTML = "";
        if (doc.exists) {
          const quizArray = doc.data()['quiz'];
          if (quizArray && quizArray.length > 0) {
            quizArray.forEach((data, i) => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <tr class="mdc-data-table__row">
                  <th class="mdc-data-table__cell" scope="row">#${i+1}</th>
                  <td class="mdc-data-table__cell">${data['title']}</td>
                  <td class="mdc-data-table__cell">${data['description']}</td>
                  <td class="mdc-data-table__cell">${data['playsCount']}</td>
                  <td class="mdc-data-table__cell">
                    <button class="mdc-button mdc-button--raised" data-id="${data['id']}">
                      <span class="mdc-button__label">Play</span>
                    </button>
                  </td>
                  <td class="mdc-data-table__cell">
                    <button class="mdc-button mdc-button--raised" data-id="${data['id']}">
                      <span class="mdc-button__label">Edit</span>
                    </button>
                  </td>
                </tr>`;
              quizListBody.append(tr);
            })
          }
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