const bespoke = require("bespoke");

function run(deck) {
    let joinButton = document.querySelector('#join__login-button');
    joinButton.addEventListener('click', e => {
        deck.slide(1);  
    })
}

module.exports = {
    run: run
};