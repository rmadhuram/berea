require('game/game');

angular.module('game')
  .config(['$stateProvider', function ($stateProvider) {

    window.console.log('Game init');

    $stateProvider

      .state('game.init', {
        url: 'init',
        templateUrl:'/app/game/init.tpl.html',
        controller:'GameInitCtrl'
      });

  }])

  .controller('GameInitCtrl', ['$scope', '$state', function($scope, $state) {
    window.console.log('Game init controller');

    var socket = io.connect();

    socket.on('showCategories', function () {
      window.console.log('show categories!');
      $state.transitionTo('game.showcat');
    });

    socket.on('showBoard', function () {
      window.console.log('show board!');
      $state.transitionTo('game.board');
    });

    socket.on('showQuestion', function () {
      window.console.log('show question!');
      $state.transitionTo('game.question');
    });

    socket.on('showAnswer', function () {
      window.console.log('show answer!');
      $state.transitionTo('game.answer');
    });
  }]);
