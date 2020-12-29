const MDCBanner = require('@material/banner').MDCBanner;
const MDCTextField = require('@material/textfield').MDCTextField;
const MDCRipple = require('@material/ripple').MDCRipple;
const banner = new MDCBanner(document.querySelector('#join__invalid-game-pin-banner'));

function run(deck, firebase) {
    const buttonRipple = new MDCRipple(document.querySelector('#join .mdc-button'));
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
    hostedQuizDocRef
        .get()
        .then(docSnapshot => {
            if (docSnapshot.exists) {
                hostedQuizDocRef.get()
                    .then(doc => {
                        const currentUsers = doc.data().users;
                        currentUsers.push(name);
                        hostedQuizDocRef
                            .set({
                                users: currentUsers
                            })
                            .then(() => deck.slide(5))
                            .catch(error => console.error(error));
                    })
            } else {
                banner.open();
            }
        })
}

module.exports = {
    run: run
};