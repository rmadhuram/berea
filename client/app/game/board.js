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

  .controller('GameBoardCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    window.console.log('GameBoardCtrl controller');

    $scope.scores = [0,0];

    $http.get('/control/board/get').success(function(data) {
      $scope.categories = data.categories;
      $scope.points = data.points;
      $scope.available = data.available;
    });

    function refreshScores() {
      $http.get('/control/scores').success(function(data) {
        $scope.scores = data;
      });
    }

    refreshScores();
    $rootScope.$on('scoreRefresh', refreshScores);

  }]);
