const MDCRipple = require('@material/ripple').MDCRipple;

function run(deck) {
    const createButton = document.querySelector('#dashboard .mdc-button');
    const buttonRipple = new MDCRipple(createButton);
    createButton.addEventListener('click', e => {
        deck.slide(3);
    });
    const account = localStorage.getItem('firebaseui::rememberedAccounts');
    if (account) {
        const accountObject = JSON.parse(account)[0];
        const displayName = accountObject.displayName;
        document.querySelector('.dashboard__header__welcome').innerHTML = `Welcome <b>${displayName}</b>!`;
    }
}

module.exports = {
    run: run
};