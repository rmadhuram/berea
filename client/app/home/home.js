angular.module('home', [])
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider

      .state('app.home', {
        url: 'home',
        templateUrl:'/app/home/home.tpl.html',
        controller:'HomeCtrl'
      });

  }])

  .controller('HomeCtrl', [function() {
     window.console.log('Home controller');
  }]);