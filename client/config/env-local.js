angular.module('env', [])
  .factory('env', function() {
    'ngInject'

    return {
      apiServer: 'http://localhost:8100/'
    }
  });
