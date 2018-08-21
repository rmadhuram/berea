angular.module('env', [])
  .factory('env', [ function() {
    return {
      apiServer: 'http://dsp-api-int.c1exchange.com:8080'
    }
  }]);
