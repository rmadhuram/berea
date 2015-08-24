require('game/game');

angular.module('game')
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('game.question', {
        url: 'question',
        templateUrl:'/app/game/question.tpl.html',
        controller:'QuestionCtrl'
      });

  }])

  .controller('QuestionCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    window.console.log('show question controller');
    $scope.time = 60;
    $scope.timeClass = 'green';

    $http.get('/control/question/get').success(function(data) {
      $scope.question = data;
      $scope.fullScore = $scope.score = data.points;

    });

    function decreaseTime() {
      $timeout(function() {
        $scope.time--;
        if ($scope.time > 0) {
          if ($scope.time <= 15) {
            $scope.score = 0.4 * $scope.fullScore;
            $scope.timeClass = 'red';
          } else if ($scope.time <= 30) {
            $scope.score = 0.6 * $scope.fullScore;
            $scope.timeClass = 'orange';
          } else if ($scope.time <= 45) {
            $scope.score = 0.8 * $scope.fullScore;
            $scope.timeClass = 'yellow';
          }
          decreaseTime();
        } else {
          $scope.score = '';
          $scope.time = '';
          $scope.expireClass = 'red';
        }
      }, 1000);
    }

    decreaseTime();
  }]);
