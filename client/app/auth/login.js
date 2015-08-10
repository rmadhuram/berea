require('app/auth/auth');

angular.module('login', ['auth', 'gettext'])

.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl:'/app/auth/login.tpl.html',
    controller:'loginCtrl'
  });
}])

.controller('loginCtrl', ['$scope', '$http', '$location', 'auth',
  function($scope, $http, $location, auth) {
    $scope.errorMsg = '';
    $scope.formData = {
      language: 'en'
    };
    $scope.sendForm = function() {

      window.console.log('send form!');
      //do http request here to verify login on platform server
      var data = $scope.formData;

      auth.authenticate(data.userName, data.password, data.language).then(function() {
        $location.path('/home');
        $('body').addClass('no-background');
      }, function(error) {
        $scope.errorMsg = error;
      });
    }; //$scope.sendForm
}]);