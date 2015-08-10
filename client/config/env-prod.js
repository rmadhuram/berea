angular.module('env', [])

.factory('env', [ function() {
  return {
    apiServer: 'api-prod.server.com',
    apiPort: 9000
  }
}]);