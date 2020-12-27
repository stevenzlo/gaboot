function getQuiz(userId, callback) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz');
    quizRef.onSnapshot(callback);
}

function deleteQuiz(userId, quizId) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz').doc(quizId);
    return quizRef.delete();
}

module.exports = {
    getQuiz: getQuiz,
    deleteQuiz: deleteQuiz
}