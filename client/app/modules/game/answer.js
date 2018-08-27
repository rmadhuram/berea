angular.module('game')
  .config(function ($stateProvider) {

    $stateProvider
      .state('root.game.answer', {
        url: '/answer/:team/:scored',
        templateUrl:'app/modules/game/answer.html',
        controller:'AnswerController'
      });

  })

  .controller('AnswerController', function($scope, questionService, $stateParams) {
    questionService.getQuestion().then(res => {
      $scope.answer = res.data.answer;

      if ($stateParams.scored > 0) {
        $scope.score = {
          team: $stateParams.team === '0' ? 'A' : 'B',
          scored: $stateParams.scored
        };
      }
    });
  });
