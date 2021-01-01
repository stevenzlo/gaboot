const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");

let allQuestions = [];
let currentQuestionIndex = null;
const choosableListeners = [];

function run(deck, firebase) {
    const db = firebase.firestore();
    const joinedGame = sessionStorage.getItem('joinedGame');
    const hostedQuizDocRef = db.collection('hosted-quiz').doc(joinedGame);
    document.querySelectorAll('.answer-quiz__options--choosable').forEach(choosable => {
        choosableListeners.push({
            target: choosable,
            handler: null
        });
    })
    getAllQuestions(hostedQuizDocRef);
    const unsubscribe = hostedQuizDocRef
        .onSnapshot(snapshot => {
            const activeQuestion = snapshot.data().activeQuestion;
            const quizEnded = !snapshot.data().started;
            if (quizEnded) {
                deck.slide(9);
                unsubscribe();
            }
            if (currentQuestionIndex !== activeQuestion.index) {
                currentQuestionIndex = activeQuestion.index;
                showCurrentOptions();
            }
            if (!activeQuestion.timedOut) {
                enableAnswerChoosing(firebase);
            } else {
                disableAnswerChoosing();
                showCorrectAnswer(currentQuestionIndex);
            }
        }, error => {
            console.error(error);
        })
}

function showCurrentOptions() {
    const number = document.querySelector('#answer-quiz__number');
    number.innerText = currentQuestionIndex + 1;
    document.querySelectorAll('.answer-quiz__options--choosable').forEach((choosable, index) => {
        choosable.innerText = allQuestions[currentQuestionIndex].options[index];
    })
}

function getAllQuestions(docRef) {
    docRef 
        .get()
        .then(doc => {
            allQuestions = doc.data().questions;
        })
        .catch(error => console.error(error));
}

function enableAnswerChoosing(firebase) {
    const choosables = document.querySelectorAll('.answer-quiz__options--choosable');
    choosables.forEach((choosable, index) => {
        const newHandler = chooseAnswerListener.bind(this, firebase, choosable, index);
        choosableListeners.push({
            target: choosable,
            handler: newHandler
        });
        choosable.disabled = false;
        choosable.classList.remove('answer-quiz__options--choosable--chosen');
        choosable.classList.remove('answer-quiz__options--choosable--correct');
        choosable.addEventListener('click', newHandler);
    })
}

function chooseAnswerListener(firebase, element, chosenAnswerIndex) {
    const db = firebase.firestore();
    const playUserId = sessionStorage.getItem('playUserId');
    const joinedGame = sessionStorage.getItem('joinedGame');
    const hostedQuizUserDocRef = db.collection('hosted-quiz').doc(joinedGame).collection('user').doc(playUserId);
    let currentAnswers = [];
    hostedQuizUserDocRef
        .get()
        .then(doc => {
            currentAnswers = doc.data().answers;
            const correctAnswer = allQuestions.find(question => question.number === currentQuestionIndex);
            const newAnswer = {
                number: currentQuestionIndex,
                result: chosenAnswerIndex === correctAnswer.correctAnswer,
                answer: chosenAnswerIndex
            }
            currentAnswers.push(newAnswer);
            hostedQuizUserDocRef
                .update({
                    answers: currentAnswers
                })
                .catch(error => {
                    console.error(error);
                })
        })
    element.classList.add('answer-quiz__options--choosable--chosen');
    disableAnswerChoosing();
    waitForCorrectAnswerToShow();
}

function disableAnswerChoosing() {
    choosableListeners.forEach(listener => {
        listener.target.disabled = true;
        listener.target.removeEventListener('click', listener.handler);
    })
}

function waitForCorrectAnswerToShow() {
    const message = document.querySelector('#answer-quiz__message');
    message.classList.add('answer-quiz__message--shown');
}

function showCorrectAnswer(correctAnswerIndex) {
    const message = document.querySelector('#answer-quiz__message');
    message.classList.remove('answer-quiz__message--shown');

    const choosables = document.querySelectorAll('.answer-quiz__options--choosable');
    choosables.forEach((choosable, index) => {
        if (index === correctAnswerIndex) {
            choosable.classList.add('answer-quiz__options--choosable--correct');
        }
    })
}

module.exports = {
    run: run
};