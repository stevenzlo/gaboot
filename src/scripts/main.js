// Require Node modules in the browser thanks to Browserify: http://browserify.org
var bespoke = require('bespoke');
var classes = require('bespoke-classes');
var nav = require('bespoke-nav');
var scale = require('bespoke-scale');
var bullets = require('bespoke-bullets');
var hash = require('bespoke-hash');
var multimedia = require('bespoke-multimedia');
var extern = require('bespoke-extern');
var firebaseConfig = require('./firebase-config');
var firebaseUi = require('./firebase-ui');
var join = require('./join');
var login = require('./login');
var dashboard = require('./dashboard');
var createQuiz = require('./create-quiz');
var quizList = require('./quiz-list');
var firebaseAuth = require('./firebase-auth');

const main = () => {
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keydown', e => {
      e.stopPropagation();
    })
  })
  const firebase = firebaseConfig.run();
  firebaseUi.run(firebase);

  // Bespoke.js
  var deck = bespoke.from({ parent: 'article.deck', slides: 'section' }, [
    classes(),
    nav(),
    scale(),
    bullets('.build, .build-items > *:not(.build-items)'),
    hash(),
    multimedia(),
    extern(bespoke)
  ]);

  join.run(deck, firebase);
  login.run(deck);
  dashboard.run(deck);
  createQuiz.run(deck, firebase);
  quizList.run(deck, firebaseAuth.signOut);
}

export default main;