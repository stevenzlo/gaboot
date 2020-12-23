function run(deck) {
    console.log("anjir");
    const createButton = document.querySelector('#list__create-button')
    createButton.addEventListener('click', () => {
        deck.slide(3);
    })
}

module.exports = {
    run: run
};