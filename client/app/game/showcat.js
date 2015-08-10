require('game/game');

angular.module('game')
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider
      .state('game.showcat', {
        url: 'showcat',
        templateUrl:'/app/game/showcat.tpl.html',
        controller:'ShowCatCtrl'
      });

  }])

  .controller('ShowCatCtrl', ['$scope', '$http', function($scope, $http) {
    window.console.log('show categories controller');
    $http.get('/control/board/get').success(function(data) {
      $scope.categories = data.categories;
    });

  }]);
