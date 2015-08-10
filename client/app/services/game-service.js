angular.module('app')
  .service('gameService', function() {
    return {



      loadState: function() {
        window.console.log('load state');
      },

      saveState: function() {
        window.console.log('save state');
      }


    };
  });