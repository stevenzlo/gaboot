const scoreboard = require('./scoreboard');
let currentQuestionIndex, timer, prevQuestionIndex, timerInterval;

function updateTotalAnswer(querySnapshot) {
  let totalAnswers = 0;
  const startQuizAnswered = document.querySelector('#start-quiz .start-quiz__answered');
  querySnapshot.forEach((doc) => {
    doc.data().answers.forEach((data) => {
      if (currentQuestionIndex != -1 && data['number'] == currentQuestionIndex) {
        totalAnswers++;
      }
    })
  })
  startQuizAnswered.innerHTML = `${totalAnswers}<br>Answers`;
}

function run() {
  const nextButton = document.querySelector('#start-quiz__top-bar--next-button');
  nextButton.addEventListener('click', () => {
    nextButtonListener();
  })
}

let nextButtonListener = () => {};

function startQuiz(quizId, gameId, deck) {
  const db = firebase.firestore();
  const startQuizGamePin = document.querySelector('#start-quiz__game-pin');
  const nextButton = document.querySelector('#start-quiz__top-bar--next-button');
  startQuizGamePin.innerHTML = `GAME PIN: ${gameId}`;
  if (firebase.auth().currentUser) {
    const quizDocRef = db.collection('users').doc(firebase.auth().currentUser.uid).collection('quiz').doc(quizId);
    quizDocRef.get().then((doc) => {
      if (doc.exists) {
        quizDocRef.update({
          playsCount: doc.data()['playsCount'] + 1
        });
      }
    })
  }
  const hostedQuizDocRef = db.collection('hosted-quiz').doc(gameId);
  const unsubscribeQuizUserRef = hostedQuizDocRef.collection('user').onSnapshot(querySnapshot => {
    updateTotalAnswer(querySnapshot);
  });
  hostedQuizDocRef.update({
    'started': true,
    'active': false,
    'activeQuestion': {
      'index': 0,
      'timedOut': false
    }
  }).then(() => {
    prevQuestionIndex = -1;
    currentQuestionIndex = 0;
    timer = undefined;
    deck.slide(11);
    const unsubscribeQuizDocRef = hostedQuizDocRef
      .onSnapshot(doc => {
        const startQuizInputQuestion = document.querySelector('#start-quiz__input--question');
        const startQuizQuestionLeft = document.querySelector('#start-quiz__question-left');
        const activeQuestion = doc.data().activeQuestion;
        const quizEnded = !doc.data().started;
        if (quizEnded) {
            unsubscribeQuizDocRef();
            unsubscribeQuizUserRef();
        }
        currentQuestionIndex = activeQuestion.index;
        if (currentQuestionIndex >= 0 && currentQuestionIndex < doc.data()['questions'].length) {
          startQuizInputQuestion.value = `${currentQuestionIndex+1}. ${doc.data()['questions'][currentQuestionIndex]['question']}`;
          startQuizQuestionLeft.innerHTML = `${currentQuestionIndex + 1}/${doc.data()['questions'].length}`;
          console.log(prevQuestionIndex, currentQuestionIndex);
          if (prevQuestionIndex !== undefined && currentQuestionIndex !== prevQuestionIndex) {
            prevQuestionIndex = currentQuestionIndex;
            timer = doc.data()['questions'][currentQuestionIndex]['timer'] + 1;
            nextButton.disabled = true;
            timerInterval = setInterval(() => {
              const startQuizTimer = document.querySelector('#start-quiz .start-quiz__timer');
              if (timer > 0) {
                timer--;
                startQuizTimer.innerHTML = timer;
              } else {
                hostedQuizDocRef.update({
                  'activeQuestion': {
                    'index': currentQuestionIndex,
                    'timedOut': true
                  }
                });
                startQuizTimer.innerHTML = '-';
                clearInterval(timerInterval);
                nextButton.disabled = false;
                nextButtonListener = () => {
                  hostedQuizDocRef.update({
                    'activeQuestion': {
                      'index': currentQuestionIndex + 1,
                      'timedOut': false
                    }
                  });
                }
              }
            }, 1000);
          }
          showCurrentOptions(doc.data()['questions'][currentQuestionIndex]['options']);
          hostedQuizDocRef.collection('user').get().then((querySnapshot) => {
            updateTotalAnswer(querySnapshot);
          })
          if (activeQuestion.timedOut) {
            showCorrectAnswer(doc.data()['questions'][currentQuestionIndex]['correctAnswer']);
          } else {
            resetOptions();
          }
        }
        if (currentQuestionIndex >= doc.data()['questions'].length - 1) {
          nextButton.innerHTML = 'Finish';
          nextButtonListener = () => {
            hostedQuizDocRef.update({
              'started': false
            });
            scoreboard.run(deck, firebase, gameId);
            deck.slide(10);
          }
        } else {
          nextButton.innerHTML = 'Next';
        }
      }, error => {
        console.error(error);
    })
  });
}

function showCurrentOptions(options) {
    document.querySelectorAll('.start-quiz__options--choosable').forEach((choosable, index) => {
        choosable.innerText = options[index];
    })
}

function resetOptions() {
  const choosables = document.querySelectorAll('.start-quiz__options--choosable');
  choosables.forEach((choosable, index) => {
    choosable.classList.remove('start-quiz__options--choosable--correct');
    choosable.disabled = false;
  })
}

function showCorrectAnswer(correctAnswerIndex) {
  const choosables = document.querySelectorAll('.start-quiz__options--choosable');
  choosables.forEach((choosable, index) => {
    if (index === correctAnswerIndex) {
        choosable.classList.add('start-quiz__options--choosable--correct');
    } else {
      choosable.disabled = true;
    }
  })
}

module.exports = {
    startQuiz: startQuiz,
    run: run
};