angular.module('env', [])

.factory('env', [ function() {
  return {
    apiServer: 'api-dev.server.com',
    apiPort: 9000
  }
}]);