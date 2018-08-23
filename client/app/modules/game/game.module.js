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
  .controller('Game1Controller', function($log) {
    'ngInject'

    $log.info('Game');
  });
