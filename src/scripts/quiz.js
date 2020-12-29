function getQuiz(userId, callback) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz').where('deleted', '==', false);
    quizRef.onSnapshot(callback);
}

function deleteQuiz(userId, quizId) {
    const quizRef = firebase.firestore().collection('users').doc(userId).collection('quiz').doc(quizId);
    return quizRef.update({
        'deleted': true
    });
}

module.exports = {
    getQuiz: getQuiz,
    deleteQuiz: deleteQuiz
}