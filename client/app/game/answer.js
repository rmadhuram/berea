require('game/game');

angular.module('game')
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('game.answer', {
        url: 'answer/:team/:scored',
        templateUrl:'/app/game/answer.tpl.html',
        controller:'AnswerCtrl'
      });

  }])

  .controller('AnswerCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
    window.console.log('show answer controller');
    $http.get('/control/question/get').success(function(data) {
      $scope.answer = data.answer;

      if ($stateParams.scored > 0) {
        $scope.score = {
          team: $stateParams.team === '0' ? 'A' : 'B',
          scored: $stateParams.scored
        };
      }
    });
  }]);
