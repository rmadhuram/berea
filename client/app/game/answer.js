require('game/game');

angular.module('game')
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('game.answer', {
        url: 'answer',
        templateUrl:'/app/game/answer.tpl.html',
        controller:'AnswerCtrl'
      });

  }])

  .controller('AnswerCtrl', ['$scope', '$http', function($scope, $http) {
    window.console.log('show answer controller');
    $http.get('/control/question/get').success(function(data) {
      $scope.answer = data.answer;
    });
  }]);
