const MDCRipple = require('@material/ripple').MDCRipple;
const ol = document.querySelector('ol.edit-quiz__list');
const questions = [];
let currentQuestionIndex = 0;

const question = document.querySelector('#edit-quiz__input--question');
const timer = document.querySelector('#edit-quiz__input--timer');
const optionOne = document.querySelector('#edit-quiz__input--option--one__label');
const optionTwo = document.querySelector('#edit-quiz__input--option--two__label');
const optionThree = document.querySelector('#edit-quiz__input--option--three__label');
const optionFour = document.querySelector('#edit-quiz__input--option--four__label');
const optionOneCheck = document.querySelector('#edit-quiz__input--option--one__radio');
const optionTwoCheck = document.querySelector('#edit-quiz__input--option--two__radio');
const optionThreeCheck = document.querySelector('#edit-quiz__input--option--three__radio');
const optionFourCheck = document.querySelector('#edit-quiz__input--option--four__radio');
const addQuestionButton = document.querySelector('#edit-quiz__add-question-button');
const buttonRipple = new MDCRipple(addQuestionButton);
const cancelQuizButton = document.querySelector('#edit-quiz__top-bar--cancel-quiz-button');
const submitQuizButton = document.querySelector('#edit-quiz__top-bar--submit-quiz-button');

function run(deck, quizId) {
    initializeQuestionList(quizId);
    initializeQuestionInput();
    cancelQuizButton.addEventListener('click', e => {
        deck.slide(4);
    })
    submitQuizButton.addEventListener('click', e => {
        saveQuiz(quizId);
    })
    addQuestionButton.addEventListener('click', e => {
        addQuestion();
    });
}

function editNewEmptyQuestion() {
    return {
        'number': questions.length + 1,
        'question': '',
        'timer': 20,
        'options': ['', '', '', ''],
        'correct': null
    };
}

function initializeQuestionInput() {
    question.addEventListener('keydown', e => {
        e.stopPropagation();
    });
    question.addEventListener('keyup', e => {
        questions[currentQuestionIndex].question = question.value;
        updateListPreview(currentQuestionIndex);
    });
    timer.addEventListener('keydown', e => {
        e.stopPropagation();
    });
    timer.addEventListener('keyup', e => {
        questions[currentQuestionIndex].timer = timer.value;
        updateListPreview(currentQuestionIndex);
    });
    optionOne.addEventListener('keydown', e => {
        e.stopPropagation();
    });
    optionOne.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[0] = optionOne.value;
    })
    optionTwo.addEventListener('keydown', e => {
        e.stopPropagation();
    });
    optionTwo.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[1] = optionTwo.value;
    })
    optionThree.addEventListener('keydown', e => {
        e.stopPropagation();
    });
    optionThree.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[2] = optionThree.value;
    })
    optionFour.addEventListener('keydown', e => {
        e.stopPropagation();
    });
    optionFour.addEventListener('keyup', e => {
        questions[currentQuestionIndex].options[3] = optionFour.value;
    })
    optionOneCheck.addEventListener('change', e => {
        if (optionOneCheck.checked)
            questions[currentQuestionIndex].correct = 0;
    })
    optionOneCheck.addEventListener('change', e => {
        if (optionTwoCheck.checked)
            questions[currentQuestionIndex].correct = 1;
    })
    optionOneCheck.addEventListener('change', e => {
        if (optionThreeCheck.checked)
            questions[currentQuestionIndex].correct = 2;
    })
    optionOneCheck.addEventListener('change', e => {
        if (optionFourCheck.checked)
            questions[currentQuestionIndex].correct = 3;
    })
}

function initializeQuestionList() {
  addQuestion();
}

function addQuestion() {
  const newQuestion = editNewEmptyQuestion();
  const newLi = editListPreviewQuestion(newQuestion);
  ol.append(newLi);
  questions.push(newQuestion);
  addListPreviewListener(newLi);
}

function editListPreviewQuestion(newQuestion) {
    const li = document.editElement('li');
    li.classList.add('edit-quiz__list__item');
    li.innerHTML = `
        <div class="edit-quiz__list__item--left">
            <p>${newQuestion.number}</p>
            <img src="https://i.imgur.com/etf85Lw.png" alt="Delete">
        </div>
        <div class="edit-quiz__list__item--right">
            <p>Quiz</p>
            <div>
                <p class="edit-quiz__list__item--right__question">
                    ${newQuestion.question ? newQuestion.question : "Type your question"}
                </p>
                <p class="edit-quiz__list__item--right__timer">
                    ${newQuestion.timer}
                </p>
                <div class="edit-quiz__list__item--right__options">
                    <div>${newQuestion.options[0]}</div>
                    <div>${newQuestion.options[1]}</div>
                    <div>${newQuestion.options[2]}</div>
                    <div>${newQuestion.options[3]}</div>
                </div>
            </div>
        </div>
    `;

    return li;
}

function addListPreviewListener(listPreview) {
    listPreview.addEventListener('click', e => {
        removeCurrentActiveListPreview();
        listPreview.classList.add('edit-quiz__list__item--active');
        const clickedIndex = Array.from(listPreview.parentNode.children).indexOf(listPreview);
        changeCurrentQuestionTo(clickedIndex);
    })
    listPreview.click();
}

function updateListPreview(index) {
    const listPreviewToUpdate = ol.children[index];
    const listPreviewQuestion = listPreviewToUpdate.querySelector('.edit-quiz__list__item--right__question');
    const listPreviewTimer = listPreviewToUpdate.querySelector('.edit-quiz__list__item--right__timer');
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
    } else if (currentCorrectAnswer == 2) {
        optionTwoCheck.checked = true;
    } else if (currentCorrectAnswer == 3) {
        optionThreeCheck.checked = true;
    } else if (currentCorrectAnswer == 4) {
        optionFourCheck.checked = true;
    } else {
        optionOneCheck.checked = false;
        optionTwoCheck.checked = false;
        optionThreeCheck.checked = false;
        optionFourCheck.checked = false;
    }
}

function removeCurrentActiveListPreview() {
    const activeLi = document.querySelector('.edit-quiz__list__item--active');
    if (activeLi) activeLi.classList.remove('edit-quiz__list__item--active');
}

function saveQuiz(quizId) {
  const db = firebase.firestore();
  if (firebase.auth().currentUser.uid) {
    const uid = firebase.auth().currentUser.uid;
    const questionsToInsert = questions.map(question => {
        return {
            number: question.number,
            question: question.question,
            correctAnswer: question.correct,
            timer: question.timer,
            options: question.options.map(option => option)
        };
    })
    // db
    //   .collection('users')
    //   .doc(uid)
    //   .collection('quiz')
    //   .doc()
    //   .set({
    //       questionsToInsert
    //   })
    //   .then(() => console.log('Quiz made!'))
    //   .catch(error => console.error(error));
  }
}

module.exports = {
  run: run
};