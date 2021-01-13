const MDCRipple = require('@material/ripple').MDCRipple;
const MDCBanner = require('@material/banner').MDCBanner;
const MDCDialog = require('@material/dialog').MDCDialog;
const MDCTextField = require('@material/textfield').MDCTextField;
const banner = new MDCBanner(document.querySelector('#create-quiz__banner'));
const dialog = new MDCDialog(document.querySelector('#create-quiz__dialog'));
const ol = document.querySelector('ol.create-quiz__list');
const questions = [];
const quizMetadata = {};
let currentQuestionIndex = 0;

const question = document.querySelector('#create-quiz__input--question');
const timer = document.querySelector('#create-quiz__input--timer');
const optionOne = document.querySelector('#create-quiz__input--option--one__label');
const optionTwo = document.querySelector('#create-quiz__input--option--two__label');
const optionThree = document.querySelector('#create-quiz__input--option--three__label');
const optionFour = document.querySelector('#create-quiz__input--option--four__label');
const optionOneCheck = document.querySelector('#create-quiz__input--option--one__radio');
const optionTwoCheck = document.querySelector('#create-quiz__input--option--two__radio');
const optionThreeCheck = document.querySelector('#create-quiz__input--option--three__radio');
const optionFourCheck = document.querySelector('#create-quiz__input--option--four__radio');
const addQuestionButton = document.querySelector('#create-quiz__add-question-button');
const buttonRipple = new MDCRipple(addQuestionButton);
const seeQuizButton = document.querySelector('#create-quiz__top-bar--see-quiz-button');
const openSubmitDialogButton = document.querySelector('#create-quiz__open-dialog-button');
const quizMetadataFields = document.querySelectorAll('.create-quiz__dialog__metadata');
const submitQuizButton = document.querySelector('#create-quiz__dialog__submit-quiz');
quizMetadataFields.forEach(field => new MDCTextField(field));

function run(deck, firebase) {
    initializeQuestionList();
    initializeQuestionInput();
    seeQuizButton.addEventListener('click', e => {
        deck.slide(4);
    });
    openSubmitDialogButton.addEventListener('click', e => {
        dialog.open();
    });
    submitQuizButton.addEventListener('click', e => {
        submitQuiz(deck, firebase);
    });
    addQuestionButton.addEventListener('click', e => {
        addQuestion();
    });
}

function createNewEmptyQuestion() {
    return {
        'number': questions.length,
        'question': '',
        'timer': 20,
        'options': ['', '', '', ''],
        'correct': null
    };
}

function initializeQuestionInput() {
    question.addEventListener('keyup', e => {
        questions[currentQuestionIndex].question = question.value;
        updateListPreview(currentQuestionIndex);
    });
    timer.addEventListener('keyup', e => {
        questions[currentQuestionIndex].timer = timer.value;
        updateListPreview(currentQuestionIndex);
    });
    optionOne.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[0] = optionOne.value;
    })
    optionTwo.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[1] = optionTwo.value;
    })
    optionThree.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[2] = optionThree.value;
    })
    optionFour.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[3] = optionFour.value;
    })
    optionOneCheck.addEventListener('change', e => {
        if (optionOneCheck.checked)
            questions[currentQuestionIndex].correct = 0;
    })
    optionTwoCheck.addEventListener('change', e => {
        if (optionTwoCheck.checked)
            questions[currentQuestionIndex].correct = 1;
    })
    optionThreeCheck.addEventListener('change', e => {
        if (optionThreeCheck.checked)
            questions[currentQuestionIndex].correct = 2;
    })
    optionFourCheck.addEventListener('change', e => {
        if (optionFourCheck.checked)
            questions[currentQuestionIndex].correct = 3;
    })
}

function initializeQuestionList() {
    addQuestion();
}

function addQuestion() {
    const newQuestion = createNewEmptyQuestion();
    const newLi = createListPreviewQuestion(newQuestion);
    ol.append(newLi);
    questions.push(newQuestion);
    addListPreviewListener(newLi);
}

function createListPreviewQuestion(newQuestion) {
    const li = document.createElement('li');
    li.classList.add('create-quiz__list__item');
    li.innerHTML = `
        <div class="create-quiz__list__item--left">
            <p>${newQuestion.number + 1}</p>
            <img id="create-quiz__list__item--left__delete" src="https://i.imgur.com/etf85Lw.png" alt="Delete">
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
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    `;

    return li;
}

function addListPreviewListener(listPreview) {
    const clickPreviewHandler = () => {
        removeCurrentActiveListPreview();
        listPreview.classList.add('.create-quiz__list__item--active');
        const clickedIndex = Array.from(listPreview.parentNode.children).indexOf(listPreview);
        changeCurrentQuestionTo(clickedIndex);
    };
    listPreview.addEventListener('click', clickPreviewHandler);
    listPreview.querySelector('#create-quiz__list__item--left__delete').addEventListener('click', e => {
        listPreview.removeEventListener('click', clickPreviewHandler);
        removeQuestion(listPreview);
    });
    listPreview.click();
}

function updateListPreview(index) {
    const listPreviewToUpdate = ol.children[index];
    const listPreviewQuestion = listPreviewToUpdate.querySelector('.create-quiz__list__item--right__question');
    const listPreviewTimer = listPreviewToUpdate.querySelector('.create-quiz__list__item--right__timer');
    listPreviewQuestion.innerText = questions[index].question ? questions[index].question : "Type your question";
    listPreviewTimer.innerText = questions[index].timer ? questions[index].timer : 0;
}

function changeCurrentQuestionTo(index) {
    currentQuestionIndex = index;
    const currentQuestion = questions[currentQuestionIndex];
    question.value = currentQuestion.question;
    timer.value = currentQuestion.timer;
    optionOne.value = currentQuestion.options[0];
    optionTwo.value = currentQuestion.options[1];
    optionThree.value = currentQuestion.options[2];
    optionFour.value = currentQuestion.options[3];
    const currentCorrectAnswer = currentQuestion.correct;
    if (currentCorrectAnswer === 0) {
        optionOneCheck.checked = true;
    } else if (currentCorrectAnswer == 1) {
        optionTwoCheck.checked = true;
    } else if (currentCorrectAnswer == 2) {
        optionThreeCheck.checked = true;
    } else if (currentCorrectAnswer == 3) {
        optionFourCheck.checked = true;
    } else {
        optionOneCheck.checked = false;
        optionTwoCheck.checked = false;
        optionThreeCheck.checked = false;
        optionFourCheck.checked = false;
    }
}

function removeCurrentActiveListPreview() {
    const activeLi = document.querySelector('.create-quiz__list__item--active');
    if (activeLi) activeLi.classList.remove('create-quiz__list__item--active');
}

function removeQuestion(liToRemove) {
    const liLength = document.querySelectorAll('.create-quiz__list__item').length;
    if (liLength === 1) {
        banner.open();
        return;
    }
    const allLis = document.querySelectorAll('.create-quiz__list__item');
    const indexOfLiToRemove = Array.from(allLis).indexOf(liToRemove);
    if (currentQuestionIndex === indexOfLiToRemove) {
        const isLiEmpty = document.querySelectorAll('.create-quiz__list__item').length === 0;
        if (!isLiEmpty) {
            currentQuestionIndex = 0;
            changeCurrentQuestionTo(0);
            Array.from(allLis)[0].click();
        }
    }
    liToRemove.parentNode.removeChild(liToRemove);
    questions.splice(indexOfLiToRemove, 1);
}

function submitQuiz(deck, firebase) {
    const title = document.querySelector('#create-quiz__dialog__metadata--title').value;
    const description = document.querySelector('#create-quiz__dialog__metadata--description').value;
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    const questionsToInsert = questions.map((question) => {
        return {
            number: question.number,
            question: question.question,
            correctAnswer: parseInt(question.correct),
            timer: parseInt(question.timer),
            options: question.options.map(option => option)
        };
    })
    db
        .collection('users')
        .doc(uid)
        .collection('quiz')
        .doc()
        .set({
            title: title,
            description: description,
            playsCount: 0,
            deleted: false,
            questionsToInsert
        })
        .then(() => {
            deck.slide(4);
        })
        .catch(error => console.error(error));
}

module.exports = {
    run: run
};