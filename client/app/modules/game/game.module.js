import io from 'socket.io-client'

angular.module('game', [])
  .config(function ($stateProvider) {
    'ngInject'

    $stateProvider
      .state('root.game', {
        url: 'game',
        templateUrl: 'app/modules/game/game.html',
        controller: 'Game1Controller'
      });

  })
  .controller('Game1Controller', function($scope, $state, $log, $rootScope) {
    'ngInject'

    $log.info('Game');
    var socket = io.connect();

    socket.on('showCategories', function () {
      $state.transitionTo('root.game.showcat');
    });

    socket.on('showBoard', function () {
      $state.transitionTo('root.game.board');
    });

    socket.on('showQuestion', function () {
      $log.info('show question!');
      $state.transitionTo('root.game.question');
    });

    socket.on('showAnswer', function(score) {
      $log.info('root.show answer !', score);
      $state.transitionTo('root.game.answer', score);
    });

    socket.on('scoreRefresh', function() {
      $log.info('emit score refresh');
      $rootScope.$broadcast('scoreRefresh');
    });
  });
