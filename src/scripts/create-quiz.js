const MDCRipple = require('@material/ripple').MDCRipple;
const ol = document.querySelector('ol.create-quiz__list');
const questions = [];

function run(deck) {
    const addQuestionButton = document.querySelector('#create-quiz__add-question-button');
    const buttonRipple = new MDCRipple(addQuestionButton);
    initializeQuestionList();
    addQuestionButton.addEventListener('click', e => {
        addQuestion();
    });
}

function createNewEmptyQuestion() {
    return {
        'number': questions.length + 1,
        'question': '',
        'timer': 20,
        'options': ['', '', '', '']
    }
}

function initializeQuestionList() {
    addQuestion();
}

function addQuestion() {
    const newQuestion = createNewEmptyQuestion();
    const newLi = createQuestionPreviewLi(newQuestion);
    ol.append(newLi);
    questions.push(newQuestion);
    addListPreviewListener(newLi);
}

function createQuestionPreviewLi(newQuestion) {
    removeCurrentActiveListPreview();

    const li = document.createElement('li');
    li.classList.add('create-quiz__list__item');
    li.classList.add('create-quiz__list__item--active');
    li.innerHTML = `
        <div class="create-quiz__list__item--left">
            <p>${newQuestion.number}</p>
            <img src="https://i.imgur.com/etf85Lw.png" alt="Delete">
        </div>
        <div class="create-quiz__list__item--right">
            <p>Quiz</p>
            <div>
                <p class="create-quiz__list__item--right__question">
                    ${newQuestion.question ? newQuestion.question : "Type your question"}
                </p>
                <p class="create-quiz__list__item--right__timer">
                    ${newQuestion.timer}
                </p>
                <div class="create-quiz__list__item--right__options">
                    <div>${newQuestion.options[0]}</div>
                    <div>${newQuestion.options[1]}</div>
                    <div>${newQuestion.options[2]}</div>
                    <div>${newQuestion.options[3]}</div>
                </div>
            </div>
        </div>
    `

    return li;
}

function addListPreviewListener(listPreview) {
    listPreview.addEventListener('click', e => {
        removeCurrentActiveListPreview();
        listPreview.classList.add('create-quiz__list__item--active');
    })
}

function removeCurrentActiveListPreview() {
    const activeLi = document.querySelector('.create-quiz__list__item--active');
    if (activeLi) activeLi.classList.remove('create-quiz__list__item--active');
}

module.exports = {
    run: run
};