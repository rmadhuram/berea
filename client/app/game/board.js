require('game/game');

angular.module('game')
  .config(['$stateProvider', function ($stateProvider) {

    window.console.log('Register board');

    $stateProvider

      .state('game.board', {
        url: 'board',
        templateUrl:'/app/game/board.tpl.html',
        controller:'GameBoardCtrl'
      });

  }])

  .controller('GameBoardCtrl', ['$scope', '$http', function($scope, $http) {
    window.console.log('GameBoardCtrl controller');

    $http.get('/control/board/get').success(function(data) {
      $scope.categories = data.categories;
      $scope.points = data.points;
      $scope.available = data.available;
    });

  }]);
