angular.module('game')
  .config(function ($stateProvider) {

    $stateProvider
      .state('root.game.question', {
        url: '/question',
        templateUrl:'app/modules/game/question.html',
        controller:'QuestionController'
      });

  })

  .controller('QuestionController', function($scope, questionService, $timeout) {
    $scope.time = 60;
    $scope.timeClass = 'green';

    var video,
      timer;

    questionService.getQuestion().then( res => {
      var data = $scope.question = res.data;
      $scope.fullScore = $scope.score = res.data.points;

      function decreaseTime() {
        timer = $timeout(function() {
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

      if (data.video) {
        $timeout(() => {
          video = $('.video-clue')[0]
          video.muted = false
          video.play()
        })

        $timeout(() => {
          video.volume = 0.3
          $scope.vidQuestion = true
          decreaseTime()
        }, 10000)

      } else {
        decreaseTime();
      }

    });

    $scope.$on('$destroy', () => {
      if (timer) {
        $timeout.cancel(timer)
      }

      if (video) {
        video.pause()
      }
    })
  });
