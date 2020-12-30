const MDCRipple = require('@material/ripple').MDCRipple;

function run(deck) {
    const createButton = document.querySelector('#dashboard__create-button');
    const listButton = document.querySelector('#dashboard__list-button');
    const createButtonRipple = new MDCRipple(createButton);
    const listButtonRipple = new MDCRipple(listButton);
    createButton.addEventListener('click', e => {
        deck.slide(3);
    });
    listButton.addEventListener('click', () => {
        deck.slide(4);
    })
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