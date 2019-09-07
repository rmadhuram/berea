const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('./questions.csv')
  .pipe(csv())
  .on('data', (data) => {
    let res = {
      level: +data['Level'],
      q: data['Question'],
      c: [data['Correct'], data['Wrong1'], data['Wrong2'], data['Wrong3']],
      r: data['Reference']
    }
    results.push(res)
  })
  .on('end', () => {
    fs.writeFileSync('./questions.json', JSON.stringify(results, null, 2))
    console.log(JSON.stringify(results, null, 2));
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });