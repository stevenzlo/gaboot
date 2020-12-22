const MDCTextField = require('@material/textfield').MDCTextField;
const MDCRipple = require('@material/ripple').MDCRipple;

function run(deck) {
    const buttonRipple = new MDCRipple(document.querySelector('#join .mdc-button'));
    const textField = new MDCTextField(document.querySelector('#join .mdc-text-field'));
    const joinButton = document.querySelector('#join__login-button');
    joinButton.addEventListener('click', e => {
        deck.slide(1);  
    })
}

module.exports = {
    run: run
};