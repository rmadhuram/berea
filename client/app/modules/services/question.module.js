export function questionService($http) {
  'ngInject'

  const ENDPOINT = '';

  function getFn(endpoint) {
    return () => {
      return $http.get(ENDPOINT + endpoint)
    }
  }

  return {
    getBoard: getFn('/control/board/get'),
    getQuestion: getFn('/control/question/get'),
    getScores: getFn('/control/scores'),

    showCategories: getFn('/control/categories/show'),
    showBoard: getFn('/control/board/show'),
    showAnnouncement: (id) => getFn('/control/announce/' + id)(),

    selectPoint: (cat, points) => getFn('/control/board/select/' + cat + '/' + points)(),

    //selectPoint: (cat, points) => { return $http.get(ENDPOINT + '/control/board/select/' + cat + '/' + points) },
    adjustScore: (team, delta) => { return $http.get(ENDPOINT + '/control/score/adjust/' + team + '/' + delta) },
    addScore: (team, percent) => { return $http.get(ENDPOINT + '/control/score/add/' + team + '/' + percent) },
    addBonus: (team) => { return $http.get(ENDPOINT + '/control/score/bonus/' + team) },

    nextRound: getFn('/control/round/next'),
    emitEvent: (event) => getFn(ENDPOINT + '/control/emit/' + event)()
  }
}