const fetch = require('node-fetch');
const csv = require('csvtojson')

module.exports = async (req, res) => {
    // const {email} = req.query
    
    fetch(`https://api.allorigins.win/get?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vRAMUFYniXHfMzwlr7Ir6U113p1XgXpQt4F1YP_Y0fUUANBx74Aga1rkMjBM9GlD47vx3GHWr6JRI-y/pub?output=csv`)
    .then(res => res.text())
    .then(async (data) => {
        csv({
            noheader: true,
            output: "csv"
        })
        .fromString(data)
        .then((csvRow)=>{ 
            console.log(csvRow);
            // const l = csvRow.length;
            // const lel = csvRow.slice(3, l);
            // res.send(lel);
            res.send(csvRow);
        })
    })
    .catch(err => {res.send(err)})
}