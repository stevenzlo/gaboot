const MDCSnackbar = require('@material/snackbar').MDCSnackbar;
let snackbar, snackbarRoot;

function run() {
  snackbarRoot = document.querySelector('.mdc-snackbar');
  snackbar = new MDCSnackbar(snackbarRoot);
  snackbar.listen('MDCSnackbar:closed', () => {
    const snackbarText = document.querySelector('.mdc-snackbar .mdc-snackbar__label');
    snackbarText.innerText = '-';
    snackbarRoot.classList.remove('snackbar-success');
    snackbarRoot.classList.remove('snackbar-danger');
  });
}

function openSnackbarMessage(message, status) {
  const snackbarText = document.querySelector('.mdc-snackbar .mdc-snackbar__label');
  snackbarText.innerText = message;
  snackbarRoot.classList.add(`snackbar-${status}`);
  snackbar.open();
}

module.exports = {
    run: run,
    openSnackbarMessage: openSnackbarMessage
}