function getQuiz(userId, callback, deck) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz').where('deleted', '==', false);
    quizRef.onSnapshot((querySnapshot) => {
        callback(querySnapshot, deck);
    });
}

function deleteQuiz(userId, quizId) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz').doc(quizId);
    return quizRef.update({
        'deleted': true
    });
}

function getQuizByQuizId(userId, quizId) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz').doc(quizId);
    return quizRef.get();
}

module.exports = {
    getQuiz: getQuiz,
    deleteQuiz: deleteQuiz,
    getQuizByQuizId: getQuizByQuizId
}