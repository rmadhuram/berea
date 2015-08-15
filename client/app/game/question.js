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
    $scope.score = 300;

    $http.get('/control/question/get').success(function(data) {
      $scope.question = data.question;
    });

    function decreaseTime() {
      $timeout(function() {
        $scope.time--;
        if ($scope.time > 0) {
          decreaseTime();
        }
      }, 1000);
    }

    decreaseTime();
  }]);
