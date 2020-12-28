function run() {
	var firebaseConfig = {
		apiKey: "AIzaSyBJl3JS7xi3AtNbPEg2CgtciPPN8XZpkcc",
		authDomain: "gaboot-58816.firebaseapp.com",
		projectId: "gaboot-58816",
		storageBucket: "gaboot-58816.appspot.com",
		messagingSenderId: "762600736695",
		appId: "1:762600736695:web:251d0797977d0932edca32",
		measurementId: "G-T2KQ215QQ1"
	};

	firebase.initializeApp(firebaseConfig);
	return firebase;
}

module.exports = {
	run: run
};