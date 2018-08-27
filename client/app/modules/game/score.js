
angular.module('game')
  .config(function ($stateProvider) {
    'ngInject'

    $stateProvider
      .state('root.game.scores', {
        url: '/scores',
        templateUrl: 'app/modules/game/score.html',
        controller: 'GameScoresController'
      });

  })
  .controller('GameScoresController', function($scope, $log, questionService) {
    'ngInject'

    questionService.getScores().then(res => {
      $scope.scores = res.data
      $log.info(res.data)

      var video = $('#jeo-video')[0]
      video.muted = false
      video.play()
    });

  });

