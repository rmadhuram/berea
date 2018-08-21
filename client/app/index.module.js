/**
 * DSP v2.0
 * (c) C1X Inc. 2017
 */

import './modules/services/services.module';
import './modules/game/game.module';
import './modules/game/init.module';
import './modules/game/showcat.module';
import './modules/game/board';
import './modules/game/question';
import './modules/game/answer';
import './modules/controller/controller.module';
import './config/env';

angular.module('jeopardy',
  ['ngCookies',
   'ngMessages',
   'ngAria',
   'ui.router',
   'ui.bootstrap',
   'services',
   'env',
   'game',
   'controller',
   'ngMaterial'
  ])
  .config(function($logProvider, $urlRouterProvider, $locationProvider, $stateProvider) {
    'ngInject'

    $logProvider.debugEnabled(true);

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
      url: '/',
      templateUrl:'app/index.module.html'
    });
  })

  .run(function($rootScope, $log, $state) {
    'ngInject'
    var onStateChange = $rootScope.$on('$stateChangeStart', function(event, toState) {
      if (toState.name === 'root.game') {
        event.preventDefault();
        $state.transitionTo('root.game.init');
      }
    });

    $rootScope.$on('$destroy', onStateChange);
  });
