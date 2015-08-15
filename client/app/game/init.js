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

  .controller('GameInitCtrl', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
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

    socket.on('showAnswer', function(score) {
      window.console.log('show answer !', score);
      $state.transitionTo('game.answer', score);
    });

    socket.on('scoreRefresh', function() {
      window.console.log('emit score refresh');
      $rootScope.$broadcast('scoreRefresh');
    });
  }]);
