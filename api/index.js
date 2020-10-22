const GSheetReader = require('g-sheets-api');
const request=require('request')
const fetch = require('node-fetch');
const csv = require('csvtojson')

const { SHEET_URI } = process.env

module.exports = async (req, res) => {
    // const {email} = req.query
    
    fetch(`https://api.allorigins.win/get?url=${SHEET_URI}`)
    .then(res => res.text())
    .then(async (data) => {
        csv({
            noheader:true,
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
    .catch(err => {console.log(err)})
}