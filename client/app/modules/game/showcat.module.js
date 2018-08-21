angular.module('game')
  .config(function ($stateProvider) {

    $stateProvider
      .state('root.game.showcat', {
        url: '/showcat',
        templateUrl:'app/modules/game/showcat.html',
        controller:'ShowCatController'
      });

  })

  .controller('ShowCatController', function($scope, $timeout, questionService, $state, $log) {
    $log.info('show categories controller');
    questionService.getBoard().then(res => {
      $scope.categories = res.data.categories
      showCat(0);
    })

    function showCat(n) {
      $log.info('show cat ' + n)
      if (n === 4) {
        $state.transitionTo('root.game.board');
        return;
      }
      $('.pt-page-' + n).addClass('pt-page-scaleDown').removeClass('pt-page-current pt-page-moveFromRight pt-page-ontop');
      $('.pt-page-' + (n + 1)).addClass('pt-page-current pt-page-moveFromRight pt-page-ontop');
      $timeout(function() {
        showCat(n + 1);
      }, 2500);
    }

  });
