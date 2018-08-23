angular.module('game')
  .config(function ($stateProvider) {

    $stateProvider
      .state('root.game.board', {
        url: '/board',
        templateUrl:'app/modules/game/board.html',
        controller:'GameBoardController'
      });

  })

  .controller('GameBoardController', function($scope, $rootScope, questionService) {
    $scope.scores = [0,0];

    questionService.getBoard().then(res => {
      $scope.categories = res.data.categories;
      $scope.points = res.data.points;
      $scope.available = res.data.available;
    })

    function refreshScores() {
      questionService.getScores().then(res => {
        $scope.scores = res.data
      });
    }

    refreshScores();
    var on = $rootScope.$on('scoreRefresh', refreshScores);
    $scope.on = on // to avoid linter error

  });
