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
      });

  })
  .controller('WWBAMController', function($log, $scope, $state) {
    'ngInject'

    $log.info('init WWBAMController');
    $scope.play = function() {
      $state.transitionTo('root.wwbam-q');
    }


  })
  .controller('WWBAMQuestionController', function($log) {
    'ngInject'

    $log.info('init WWBAMController');
  });