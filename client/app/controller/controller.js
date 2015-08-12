angular.module('controller', [])
  .config(['$stateProvider', function ($stateProvider) {

    $stateProvider

      .state('ctrl', {
        url: '/ctrl',
        template: '<div class="controller"><ui-view/></div>',
        abstract: true,
        controller: 'GameController'
      })

      .state('ctrl.init', {
        url: '/init',
        templateUrl: '/app/controller/init.tpl.html',
        controller: 'GameInitController'
      })

      .state('ctrl.showBoard', {
        url: '/showBoard',
        templateUrl: '/app/controller/show-board.tpl.html',
        controller: 'GameShowBoardController'
      })

      .state('ctrl.board', {
        url: '/board',
        templateUrl: '/app/controller/board.tpl.html',
        controller: 'GameBoardController'
      })

      .state('ctrl.question', {
        url: '/question',
        templateUrl: '/app/controller/question.tpl.html',
        controller: 'GameQuestionController'
      });

  }])

  .controller('GameController', [function() {
     window.console.log(' controller');
     $('body').css('background', 'white');
  }])

  .controller('GameInitController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.showCat = function() {
      $http.get('/control/categories/show').success(function() {
        $state.go('ctrl.showBoard');
      });
    };
  }])

  .controller('GameShowBoardController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.showBoard = function() {
      $http.get('/control/board/show').success(function() {
        $state.go('ctrl.board');
      });
    };
  }])

  .controller('GameBoardController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $http.get('/control/board/get').success(function(data) {
      $scope.categories = data.categories;
      $scope.points = data.points;
      $scope.available = data.available;
    });

    $scope.selected = [null, null];

    $scope.select = function(cat, point) {
      if ($scope.available[cat][point]) {
        $scope.selected = [cat, point];
      }
    };

    $scope.selectPoint = function() {
      $http.get('/control/board/select/' + $scope.selected[0] + '/' + $scope.selected[1]).success(function() {
        window.console.log('selected');
        $state.go('ctrl.question');
      });
    };

  }])

  .controller('GameQuestionController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.showBoard = function() {
      $http.get('/control/board/show').success(function() {
        $state.go('ctrl.board');
      });
    };
  }]);
