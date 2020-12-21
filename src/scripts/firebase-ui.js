function run() {
	var ui = new firebaseui.auth.AuthUI(firebase.auth());
	var uiConfig = {
		callbacks: {
			signInSuccessWithAuthResult: function(authResult, redirectUrl) {
				document.querySelector('#login__message-login--success').style.display = 'block'
				return true;
			},
			uiShown: function() {
				document.querySelector('#join__loader').style.display = 'none';
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