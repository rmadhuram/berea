exports.init = function(app, io, dataDir) {

  var fs = require('fs'),
    express = require('express'),
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
      available: [[1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1]],
      teamNames: ['Team A', 'Team B'],
      scores: [0, 0],
      questionStartTime: 0
    },

    gameData;


  function persistState() {
    fs.writeFileSync(STATE_FILE, JSON.stringify(gameState, null, '\t'));
  }

  // load game state if any present.
  if (fs.existsSync(STATE_FILE)) {
    var data = fs.readFileSync(STATE_FILE, 'UTF-8');
    gameState = JSON.parse(data);
    console.log('Current round: ' + gameState.currentRound);
  } else {
    console.log('No state file present.');
  }

  function loadGame() {
    // load game data.
    if (fs.existsSync(dataDir) && fs.existsSync(dataDir + '/game.json')) {
      var data = fs.readFileSync(dataDir + '/game.json', 'UTF-8');
      gameData = JSON.parse(data);

      app.use('/assets', express.static(dataDir));
    } else {
      console.log('No data file present.');
      process.exit(1);
    }
  }

  loadGame()

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

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
    console.log('get current board! ', gameState);

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
    gameState.questionStartTime = new Date().getTime();
    gameState.currentState = states.SHOW_QUESTION;
    gameState.currentQuestion = [+cat, +points];
    gameState.available[cat][points] = 0;

    persistState();
    res.json("OK");
  });

  app.get('/control/question/get', function(req, res) {
    var currentRoundData = gameData.rounds[gameState.currentRound],
      currentQuestion = gameState.currentQuestion;

    console.log(currentQuestion)
    var question = currentRoundData.categories[currentQuestion[0]].questions[currentQuestion[1]];
    question.points = currentRoundData.points[currentQuestion[1]];
    question.category = currentRoundData.categories[currentQuestion[0]].name
    res.json(question);

  });

  // Transition to show answer
  app.get('/control/answer/show', function(req, res) {
    io.emit('showAnswer');
    gameState.currentState = states.SHOW_ANSWER;

    persistState();
    res.json("OK");
  });

  // Get scores
  app.get('/control/scores', function(req, res) {
    res.json(gameState.scores);
  });

  // Add score for current question.
  // Time is kept from when a question is selected.
  // fraction is for other team scoring.
  app.get('/control/score/add/:team/:fraction', function(req, res) {
    var currentTime = new Date().getTime(),
      addedScore = 0,
      fraction = +req.param('fraction'),
      team = +req.param('team');

    if (gameState.questionStartTime != 0) {
      var currentRoundData = gameData.rounds[gameState.currentRound],
        currentQuestion = gameState.currentQuestion,
        points = currentRoundData.points[currentQuestion[1]],
        timeReduction = 0;

      var elapsed = (currentTime - gameState.questionStartTime) / 1000;
      if (elapsed < 15) {
        timeReduction = 1;
      } else if (elapsed < 30) {
        timeReduction = 0.8;
      } else if (elapsed < 45) {
        timeReduction = 0.6;
      } else if (elapsed < 60) {
        timeReduction = 0.4;
      }

      points = timeReduction * points;
      addedScore = (points * fraction) / 100;

      gameState.scores[team] += addedScore;
      persistState();
    }

    console.log('show answer emit!!');
    io.emit('showAnswer', {team: team, scored: addedScore});
    gameState.currentState = states.SHOW_ANSWER;

    res.json(addedScore);

  });

  app.get('/control/score/bonus/:team', function(req, res) {
    var currentTime = new Date().getTime(),
      addedScore = 0,
      team = +req.param('team');

    var currentRoundData = gameData.rounds[gameState.currentRound],
      currentQuestion = gameState.currentQuestion,
      points = currentRoundData.points[currentQuestion[1]];

    addedScore = (points * 0.4);

    gameState.scores[team] += addedScore;
    persistState();

    console.log('show answer emit!!');
    io.emit('showAnswer', {team: team, scored: addedScore});
    gameState.currentState = states.SHOW_ANSWER;

    res.json(addedScore);

  });

  // Adjust score
  app.get('/control/score/adjust/:team/:delta', function(req, res) {
    var delta = +req.param('delta'),
      team = +req.param('team');

    gameState.scores[team] += delta;
    persistState();
    io.emit('scoreRefresh');
    res.json('OK');
  });


  // Transition to next round
  app.get('/control/round/next', function(req, res) {
    gameState.currentRound++;
    gameState.available = [[1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1], [1,1,1,1,1]];

    if (gameState.currentRound == 1) {
      io.emit('showBoard');
    }
    persistState();
    res.json("OK");
  });

  // Show announcements
  app.get('/control/announce/:id', function(req, res) {
    io.emit('announce', req.param('id'))
    res.json("OK");
  });

  // emit any generic event.
  app.get('/control/emit/:event', function(req, res) {
    io.emit(req.param('event'))
    res.json('OK')
  });

  // Reload game data
  app.get('/control/reload', function(req, res) {
    loadGame()
    res.json('OK')
  });
};