const MDCRipple = require('@material/ripple').MDCRipple;

function run(deck) {
    const createButton = document.querySelector('#dashboard .mdc-button');
    const buttonRipple = new MDCRipple(createButton);
    createButton.addEventListener('click', e => {
        deck.slide(3);
    });
}

module.exports = {
    run: run
};