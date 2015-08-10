require('auth/login');
require('home/home');
require('header/header');

angular.module('app', [
  'ui.router',
  'auth',
  'login',
  'home',
  'header',
  'game',
  'controller',
  'gettext', // translation
  'env'   // added by build system.
])

  .config(['$stateProvider', '$locationProvider',
    function ($stateProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
    }
  ])

  .run(['$rootScope',  '$state',  function($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      window.console.log('transition to ' + toState.name);

      if (toState.name === 'game') {
        event.preventDefault();
        $state.transitionTo('game.init');
      }

    });
  }]);

