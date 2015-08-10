exports.init = function(app, io, dataFile) {

  var fs = require('fs'),
    STATE_FILE = './data/game-state.json',

    states = {
      INTRO: 1,
      SHOW_CAT: 2,
      SHOW_BOARD: 3,
      SHOW_QUESTION: 4,
      SHOW_ANSWER: 5
    },

    gameState = {
      currentRound: 0,
      currentState: states.INTRO,
      currentQuestion: null,
      boardState: null,
      available: [[0,1,1,0,1], [0,0,0,1,0], [1,1,1,0,1], [1,1,1,1,1]],
      teamNames: ['Team A', 'Team B'],
      scores: [0, 0]
    },

    gameData;


  function persistState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(gameState, null, '\t'));
  }

  // load game state if any present.
  if (fs.existsSync(STATE_FILE)) {
    var data = fs.readFileSync(STATE_FILE, 'UTF-8');
    console.log(data);
  } else {
    console.log('No state file present.');
  }

  // load game data.
  if (fs.existsSync(dataFile)) {
    var data = fs.readFileSync(dataFile, 'UTF-8');
    gameData = JSON.parse(data);
  } else {
    console.log('No data file present.');
    process.exit(1);
  }

  app.get('/control/categories/show', function(req, res) {
    console.log('show categories!');
    io.emit('showCategories');
    gameState.currentState = states.SHOW_CAT;
    persistState();
    res.json("OK");
  });

  // Transition to show current board
  app.get('/control/board/show', function(req, res) {
    console.log('show board!');
    io.emit('showBoard');
    gameState.currentState = states.SHOW_BOARD;
    persistState();
    res.json("OK");
  });

  // Get current board state
  app.get('/control/board/get', function(req, res) {
    console.log('get current board!');
    var currentRoundData = gameData.rounds[gameState.currentRound],
      payload = {
        points: currentRoundData.points
      };

    payload.categories = currentRoundData.categories.map(function(d) {
      return d.name;
    });

    payload.available = gameState.available;

    res.json(payload);
  });

  // Transition to selected question
  app.get('/control/board/select/:cat/:points', function(req, res) {
    var cat = req.param('cat'),
      points = req.param('points');

    console.log('select question: ' + req.param('cat') + ' , ' + req.param('points'));
    io.emit('showQuestion');
    gameState.currentState = states.SHOW_QUESTION;
    gameState.currentQuestion = [+cat, +points];
    gameState.available[cat][points] = 0;

    persistState();
    res.json("OK");
  });

  app.get('/control/question/get', function(req, res) {
    var currentRoundData = gameData.rounds[gameState.currentRound],
      currentQuestion = gameState.currentQuestion;

    var question = currentRoundData.categories[currentQuestion[0]].questions[currentQuestion[1]];
    res.json(question);

  });

  // Transition to show answer
  app.get('/control/answer/show', function(req, res) {
    io.emit('showAnswer');
    gameState.currentState = states.SHOW_ANSWER;

    persistState();
    res.json("OK");
  });


};