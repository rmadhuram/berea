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

  .controller('ShowCatCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    window.console.log('show categories controller');
    $http.get('/control/board/get').success(function(data) {
      $scope.categories = data.categories;
    });


    function showCat(n) {
      if (n === 4) {
        return;
      }
      $('.pt-page-' + n).addClass('pt-page-scaleDown');
      $('.pt-page-' + (n + 1)).addClass('pt-page-current pt-page-moveFromRight pt-page-ontop');
      $timeout(function() {
        showCat(n + 1);
      }, 2000);
    }

    $timeout(function() {
      showCat(0);
    }, 0);

  }]);
