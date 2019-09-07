export function WWBAMService($http, $log, $q) {
  'ngInject'

  $log.info('HERE')

  let rands = []

  class Randomizer {
    constructor(size) {
      this.weights = Array(size).fill(1)
    }

    getRandom() {
      // normalize
      let sum = this.weights.reduce((total, num) => total + num, 0)
      let norm = this.weights.map(w => w/sum)
      sum = 0

      $log.info('weights: ', norm)

      let p = Math.random()
      for (let i = 0; i < norm.length; i++ ) {
        sum += norm[i]
        if (p < sum) {
          this.weights[i] = 0.1 * this.weights[i]
          for (let j = 0; j < norm.length; j++ ) {
            if (i != j) {
              this.weights[j] += 0.3 * (1 - this.weights[j])
            }
          }
          return i
        }
      }
    }
  }

  let questions = null

  function fetchAll() {
    return $q((resolve) => {
      if (questions) {
        resolve(questions)
      } else {
        $http.get('/img/wwbam/questions.json').then((res) => {
          let data = res.data,
            buckets = []

          data.map(d => {
            if (buckets[d.level - 1]) {
              buckets[d.level - 1].push(d)
            } else {
              buckets[d.level - 1] = [d]
            }
          })

          for (let i = 0; i < 5; i++) {
            rands[i] = new Randomizer(buckets[i].length)
          }

          questions = buckets
          resolve(questions)
        })
      }
    })
  }

  function getQuestions() {
    return $q((resolve) => {
      fetchAll().then((q) => {
        let quest = []
        for (let i = 0; i < 5; i++) {
          let rnd = rands[i].getRandom()
          quest.push(q[i][rnd])
        }
        resolve(quest)
      })
    })
  }

  return {
    getQuestions: getQuestions
  }
}