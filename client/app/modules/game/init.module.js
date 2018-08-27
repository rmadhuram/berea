
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
  .controller('GameInitController', function($scope, $log, socketService) {
    'ngInject'

    $log.info('Game Init111');
    var socket = socketService.getSocket()
    socket.on('play', function() {
      $log.info('Play!')
      var video = $('#jeo-video')[0]
      video.muted = false
      video.play()
    })

  });

