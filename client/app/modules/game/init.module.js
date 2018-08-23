
angular.module('game')
  .config(function ($stateProvider) {
    'ngInject'

    $stateProvider
      .state('root.game.init', {
        url: '/init',
        templateUrl: 'app/modules/game/init.html',
        controller: 'GameInitController'
      });

  })
  .controller('GameInitController', function($scope, $log, socketService, $state, $rootScope) {
    'ngInject'

    $log.info('Game Init111');

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

    socket.on('play', function() {
      $log.info('Play!')
      var video = $('#jeo-video')[0]
      video.muted = false
      video.play()
    });

  });

