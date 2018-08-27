angular.module('game')
  .config(function ($stateProvider) {

    $stateProvider
      .state('root.game.announce', {
        url: '/announce/:id',
        templateUrl:'app/modules/game/announce.html',
        controller:'AnnounceController'
      });

  })

  .controller('AnnounceController', function($scope, $stateParams, socketService, $log) {
    var annId = $scope.id = $stateParams.id,
      ctr = 1

    socketService.getSocket().on('next', () => {
      $log.info('next event')
      $('.ann-' + annId + '-' + ctr).removeClass('invisible')
      ctr++
    })

  });
