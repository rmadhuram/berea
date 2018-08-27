angular.module('game', ['ngSanitize'])
  .config(function ($stateProvider) {
    'ngInject'

    $stateProvider
      .state('root.game', {
        url: 'game',
        templateUrl: 'app/modules/game/game.html',
        controller: 'Game1Controller'
      });

  })
  .controller('Game1Controller', function($log, socketService, $state, $rootScope) {
    'ngInject'

    $log.info('init socket');
    var socket = socketService.init()

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

    socket.on('announce', function(pageId) {
      $log.info('announce', pageId);
      $state.transitionTo('root.game.announce', {id: pageId});
    });

  });
