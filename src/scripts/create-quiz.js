function run(deck) {
    const listButton = document.querySelector('#create__list-button');
    listButton.addEventListener('click', () => {
        deck.slide(4);
    })
}

module.exports = {
    run: run
};