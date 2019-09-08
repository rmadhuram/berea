angular.module('wwbam', ['ngSanitize'])
  .config(function ($stateProvider) {
    'ngInject'

    $stateProvider
      .state('root.wwbam', {
        url: 'wwbam',
        templateUrl: 'app/modules/wwbam/wwbam.html',
        controller: 'WWBAMController'
      })
      .state('root.wwbam-q', {
        url: 'wwbam-q',
        templateUrl: 'app/modules/wwbam/question.html',
        controller: 'WWBAMQuestionController'
      })
      .state('root.wwbam-thanks', {
        url: 'wwbam-thanks',
        templateUrl: 'app/modules/wwbam/thanks.html',
        controller: 'WWBAMThanksController'
      });

  })
  .controller('WWBAMController', function($log, $scope, $state) {
    'ngInject'

    $log.info('init WWBAMController');
    $scope.play = function() {
      $state.transitionTo('root.wwbam-q');
    }

  })
  .controller('WWBAMQuestionController', function($scope, $log, wwbamService, $timeout, $interval, $state) {
    'ngInject'

    $scope.isFrozen = false
    $scope.wrongAnswer = false
    $scope.rightAnswer = false
    $scope.currentLevel = 0

    function nextQuestion() {
      stopTimer()
      $scope.isFrozen = false
      $scope.wrongAnswer = false
      $scope.rightAnswer = false
      $scope.currentLevel++
      if ($scope.currentLevel > 5) {
        // finished all
        $timeout(() => {
          $state.transitionTo('root.wwbam-thanks');
        }, 3000)
        return
      }

      $scope.question = $scope.questions[$scope.currentLevel - 1]
      if ($scope.currentLevel < 3) {
        playMusic('1001000')
      } else {
        playMusic('125000')
      }

      startTimer()
    }

    function playMusic(file) {
      if (!file) return;
      $log.info('file: ', file)
      $timeout(() => {
        $('#q-audio-src')[0].src = `/img/wwbam/sounds/${file}.mp3`
        $('#q-audio')[0].load()
        $('#q-audio')[0].play()
      })
    }

    let timer = null

    function startTimer() {
      $scope.timeCounter = 30;
      timer = $interval(() => {
        if ($scope.timeCounter == 0) {
          stopTimer()
          $scope.isFrozen = true
          $scope.wrongAnswer = true
          showWrong()
          return
        }
        $scope.timeCounter--
      }, 1000)
    }

    function stopTimer() {
      if (timer) {
        $interval.cancel(timer)
      }
    }

    function showWrong(option) {
      playMusic('wrong')

      if (option) {
        option.showWrong = true
      }
      for (let choice of $scope.question.c) {
        if (choice.correct) {
          choice.showCorrect = true
        }
      }

      $timeout(() => {
        $state.transitionTo('root.wwbam-thanks');
      }, 6000)
    }

    $scope.chooseOption = function(option) {
      if ($scope.isFrozen) {
        return
      }

      playMusic('final')
      option.selected = true
      $scope.isFrozen = true
      stopTimer()
      $timeout(() => {

        delete option.selected
        if (!option.correct) {
          $scope.wrongAnswer = true
        } else {
          $scope.rightAnswer = true
        }

        if (option.correct) {
          option.showCorrect = true
          playMusic('correct')
          $timeout(nextQuestion, 3000)
        } else {
          showWrong(option)

        }
      }, 2000)
    }

    $log.info('init WWBAMController');
    wwbamService.getQuestions().then((questions) => {
      questions = angular.fromJson(angular.toJson(questions))

      // shuffle answers
      questions.map(q => {
        q.c = q.c.map(choice => {
          return {
            text: choice
          }
        })
        q.c[0].correct = true

        for (let i = 0; i < 500; i++) {
          let n1 = Math.floor(Math.random() * 4),
            n2 = Math.floor(Math.random() * 4)

          if (n1 != n2) {
            let x = q.c[n1]
            q.c[n1] = q.c[n2]
            q.c[n2] = x
          }
        }
      })

      $scope.questions = questions
      nextQuestion()
    })

    playMusic('1001000')

  })
  .controller('WWBAMThanksController', function($log, $scope, $state) {
    'ngInject'

    $log.info('init WWBAMThanksController');
    $scope.finish = function() {
      $state.transitionTo('root.wwbam');
    }

  })