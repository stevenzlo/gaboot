function signOut(deck) {
  firebase.auth().signOut().then(function() {
    deck.slide(0);
  }).catch(function(error) {
    console.log(error);
  });
}


module.exports = {
	signOut: signOut
};