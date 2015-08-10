angular.module('auth', [])

.factory('auth', ['$http', '$q', 'env', '$timeout', 'gettextCatalog',
  function($http, $q, env, $timeout, gettextCatalog) {

  var loggedInUser = null;


  return {

    /**
     * Get authenticated user object.
     */
    getUser: function() {
      return loggedInUser;
    },

    /**
     * Is the user authenticated?
     */
    isAuthenticated: function() {

      if (angular.isObject(loggedInUser)) {
        window.console.log('User exists');
        return true;
      }

      // check if session is in sessionStorage.
      if (window.sessionStorage.loggedInUser) {
        loggedInUser = JSON.parse(window.sessionStorage.loggedInUser);
        gettextCatalog.currentLanguage = loggedInUser.lang;
        gettextCatalog.debug = true;
        return true;
      }

      window.console.log('User does not exist!');
      return false;
    },

    /**
     * Authenticate the user with the given credentials.
     * Returns a promise that is resolved on success.
     */
    authenticate: function(userName, password, language) {
      var deferred = $q.defer();

      $timeout(function() {
        if (userName === 'test' && password === 'test') {

          loggedInUser = {
            userName: userName,
            lang: language
          };

          window.sessionStorage.loggedInUser = JSON.stringify(loggedInUser);

          gettextCatalog.currentLanguage = language;
          gettextCatalog.debug = true;

          deferred.resolve(loggedInUser, 2000);
        } else {
          deferred.reject('invalid password');
        }
      });

      return deferred.promise;
    }
  };

}]);