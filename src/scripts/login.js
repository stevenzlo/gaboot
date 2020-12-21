function run(deck) {
    let joinButton = document.querySelector('#login__join-button')
    joinButton.addEventListener('click', e => {
        deck.slide(0);
    })
}

module.exports = {
    run: run
};