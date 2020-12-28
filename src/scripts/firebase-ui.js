function run(firebase) {
	const db = firebase.firestore();
	const ui = new firebaseui.auth.AuthUI(firebase.auth());
	const uiConfig = {
		callbacks: {
			signInSuccessWithAuthResult: function(authResult, redirectUrl) {
				const uid = authResult.user.uid;
				const email = authResult.additionalUserInfo.profile.email;
				const name = authResult.additionalUserInfo.profile.name;
				db.collection('users').doc(uid).set({
					name: name,
					email: email
				})
				.then(() => console.log(`Document successfully written with uid ${uid}`))
				.catch((error) => console.error(error));

				document.querySelector('#login__message-login--success').style.display = 'block';
				return true;
			}
		},
		signInSuccessUrl: `${window.location.origin}/#dashboard`,
		signInOptions: [
			firebase.auth.GoogleAuthProvider.PROVIDER_ID
		]
	};

	ui.start('#login__firebaseui-auth-container', uiConfig);
}

module.exports = {
	run: run
};