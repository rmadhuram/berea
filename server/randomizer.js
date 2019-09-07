
class Randomizer {
  constructor(size) {
    this.weights = Array(size).fill(1)
  }

  getRandom() {
    // normalize
    let sum = this.weights.reduce((total, num) => total + num, 0)
    let norm = this.weights.map(w => w/sum)
    console.log(norm)
    sum = 0

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