const MDCRipple = require('@material/ripple').MDCRipple;

function run(deck) {
    const buttonRipple = new MDCRipple(document.querySelector('#dashboard .mdc-button'));
}

module.exports = {
    run: run
};