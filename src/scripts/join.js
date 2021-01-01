const MDCBanner = require('@material/banner').MDCBanner;
const MDCTextField = require('@material/textfield').MDCTextField;
const MDCRipple = require('@material/ripple').MDCRipple;
const buttonRipple = new MDCRipple(document.querySelector('#join .mdc-button'));
const banner = new MDCBanner(document.querySelector('#join__banner'));
const joinDashboard = require('./join-dashboard');

function run(deck, firebase) {
    document.querySelectorAll('#join .mdc-text-field').forEach(elem => {
        new MDCTextField(elem);
    })
    
    const joinButton = document.querySelector('#join__login-button');
    joinButton.addEventListener('click', e => {
        deck.slide(1);  
    })

    const playButton = document.querySelector('#join__play-button');
    playButton.addEventListener('click', e => {
        joinQuiz(deck, firebase);
    })
}

function joinQuiz(deck, firebase) {    
    const db = firebase.firestore();
    const name = document.querySelector('#join__name--input').value;
    const pin = document.querySelector('#join__pin--input').value;
    const hostedQuizDocRef = db.collection('hosted-quiz').doc(pin);
    const hostedQuizUsersDocRef = db.collection('hosted-quiz').doc(pin).collection('user');
    hostedQuizDocRef
        .get()
        .then(docSnapshot => {
            if (docSnapshot.exists) {
                hostedQuizDocRef.get()
                    .then(doc => {
                        const active = doc.data().active;
                        if (!active) {
                            showErrorBanner('The game you wanted to join has already started');
                            return;
                        }
                        const newUser = {
                            answers: [],
                            name: name
                        };
                        hostedQuizUsersDocRef
                            .add(newUser)
                            .then(docRef => {
                                sessionStorage.setItem('playUserId', docRef.id);
                                sessionStorage.setItem('joinedGame', pin);
                                deck.slide(5);
                                joinDashboard.run(deck, firebase);
                            })
                            .catch(error => {
                                console.error(error);
                                showErrorBanner('Failed in trying to join the game, try again');
                            });
                    })
            } else {
                showErrorBanner('The game does not exist');
            }
        })
}

function showErrorBanner(message) {
    const bannerMessage = document.querySelector('#join__banner--message');
    bannerMessage.innerText = message;
    banner.open();
}

module.exports = {
    run: run
};