angular.module('game', [])
  .config(['$stateProvider', function ($stateProvider) {

    window.console.log('Register game');

    $stateProvider

      .state('game', {
        url: '/',
        template: '<ui-view/>',
        controller: 'GameCtrl'
      });

  }])

  .controller('GameCtrl', [function() {
     window.console.log('Game controller');
  }]);
