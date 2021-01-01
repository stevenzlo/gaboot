const answerQuiz = require('./answer-quiz');

function run(deck, firebase) {
    const db = firebase.firestore();
    const playUserId = sessionStorage.getItem('playUserId');
    const joinedGame = sessionStorage.getItem('joinedGame');
    const hostedQuizUsersDocRef = db.collection('hosted-quiz').doc(joinedGame).collection('user');
    const unsubscribeHostedQuizUsersListener = hostedQuizUsersDocRef
        .onSnapshot(snapshots => {
            const names = [];
            snapshots.forEach(doc => {
                names.push(doc.data().name);
            });
            updateLobbyMembers(names);
        }, error => {
            console.error(error);
        })

    const hostedQuizDocRef = db.collection('hosted-quiz').doc(joinedGame);
    const unsubscribeHostedQuizListener = hostedQuizDocRef
        .onSnapshot(snapshot => {
            const started = snapshot.data().started;
            if (started) {
                deck.slide(7);
                unsubscribeHostedQuizListener();
                unsubscribeHostedQuizUsersListener();
                answerQuiz.run(deck, firebase);
            }
        }, error => {
            console.error(error);
        })
}

function updateLobbyMembers(names) {
    const lobby = document.querySelector('#join-dashboard__lobby');
    const lobbyInnerHTML = names.map(name => `
        <div class="join-dashboard__lobby--member">${name}</div>
    `).join('\n');
    lobby.innerHTML = lobbyInnerHTML;
}

module.exports = {
    run: run
};