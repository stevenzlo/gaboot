function run() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    var uiConfig = {
        signInSuccessUrl: `${window.location.origin}`,
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };

    ui.start('#firebaseui-auth-container', uiConfig);
}

module.exports = {
    run: run
};