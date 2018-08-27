angular.module('env', [])
  .factory('env', function() {
    'ngInject'

    return {
      apiServer: '/'               // served from the same server.
    }
  });


