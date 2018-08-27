angular.module('env', [])
  .factory('env', [ function() {
    return {
      apiServer: 'http://dsp-api-stg.c1exchange.com:8080'
    }
  }]);
