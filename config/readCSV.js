const csv = require('csv-parser')
const fs = require('fs');
const { dirname } = require('path');
const results = [];



async function readCSV(cb){
    fs.createReadStream(__dirname + "/alunos.csv")
    .pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log(results)
        cb(results)
    })
}

module.exports = {
    readCSV: readCSV
}