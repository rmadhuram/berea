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

  .controller('QuestionCtrl', ['$scope', '$http', function($scope, $http) {
    window.console.log('show question controller');
    $http.get('/control/question/get').success(function(data) {
      $scope.question = data.question;
    });
  }]);
