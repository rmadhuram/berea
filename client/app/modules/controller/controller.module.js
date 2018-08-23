angular.module('controller', [])
  .config(function ($stateProvider) {

    $stateProvider

      .state('root.ctrl', {
        url: 'ctrl',
        template: '<div class="controller"><ui-view/></div>',
        abstract: true,
        controller: 'RemoteController'
      })

      .state('root.ctrl.init', {
        url: '/init',
        templateUrl: 'app/modules/controller/init.html',
        controller: 'RemoteInitController'
      })

      .state('root.ctrl.showBoard', {
        url: '/showBoard',
        templateUrl: 'app/modules/controller/show-board.html',
        controller: 'RemoteShowBoardController'
      })

      .state('root.ctrl.board', {
        url: '/board',
        templateUrl: 'app/modules/controller/board.html',
        controller: 'RemoteBoardController'
      })

      .state('root.ctrl.question', {
        url: '/question',
        templateUrl: 'app/modules/controller/question.html',
        controller: 'RemoteQuestionController'
      });

  })

  .controller('RemoteController', function() {
    $('body').css('background', 'white');
  })

  .controller('RemoteInitController', function($scope, questionService, $state) {
    $scope.play = () => questionService.emitEvent('play')

    $scope.showRules = function() {
      questionService.showAnnouncement(1)
    };

    $scope.showNext = function() {
      questionService.emitEvent('next')
    };

    $scope.showCat = function() {
      questionService.showCategories().then(function() {
        $state.go('root.ctrl.showBoard');
      });
    };
  })

  .controller('RemoteShowBoardController', function($scope, questionService, $state) {
    $scope.showBoard = function() {
      questionService.showBoard().then(function() {
        $state.go('root.ctrl.board');
      });
    };
  })

  .controller('RemoteBoardController', function($scope, questionService, $state) {
    questionService.getBoard().then(function(res) {
      var data = res.data
      $scope.categories = data.categories;
      $scope.points = data.points;
      $scope.available = data.available;
      var allClear = true;
      _.each($scope.available, function(cat) {
        _.each(cat, function(point) {
          if (point === 1) {
            allClear = false;
          }
        });
      });

      $scope.allClear = allClear;
    });

    $scope.selected = [null, null];
    $scope.allClear = false;

    $scope.select = function(cat, point) {
      if ($scope.available[cat][point]) {
        $scope.selected = [cat, point];
      }
    };

    $scope.selectPoint = function() {
      questionService.selectPoint($scope.selected[0], $scope.selected[1]).then(() => {
        $state.go('root.ctrl.question');
      });
    };

    $scope.nextRound = function() {
      questionService.nextRound().then(function() {
        $state.go('root.ctrl.init');
      });
    };

    $scope.adjustScore = function(team, scoreDelta) {
      questionService.adjustScore(team, scoreDelta)
    };

  })

  .controller('RemoteQuestionController', function($scope, questionService, $state) {
    questionService.getQuestion().then(function(res) {
      $scope.question = res.data.question;
      $scope.answer = res.data.answer;
    });

    $scope.addScore = function(team, percent) {
      questionService.addScore(team, percent).then(() => {
        $state.go('root.ctrl.showBoard');
      });
    };

    $scope.addBonus = function(team) {
      questionService.addBonus(team).then(() => {
        $state.go('root.ctrl.showBoard');
      });
    };

    $scope.pass = function() {
      questionService.addScore(0, 0).then(() => {
        $state.go('root.ctrl.showBoard');
      });
    };

  });
