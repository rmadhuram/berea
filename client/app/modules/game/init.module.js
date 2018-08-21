
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
  .controller('GameInitController', function($scope, $log) {
    'ngInject'

    $log.info('Game Init111');

  });

