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

  .controller('GameCtrl', ['$scope', function($scope) {
     window.console.log('Game controller');
  }]);
