const GSheetReader = require('g-sheets-api');
const request=require('request')
const fetch = require('node-fetch');
const csv = require('csvtojson')

const { SHEET_URI } = process.env

module.exports = async (req, res) => {
    const {email} = req.query
    
        fetch(SHEET_URI)
        .then(res => res.text())
        .then(async (data) => {
            csv({
                noheader:true,
                output: "csv"
            })
            .fromString(data)
            .then((csvRow)=>{ 
                const l = csvRow.length;
                const lel = csvRow.slice(3, l);
                res.send(lel);
            })
        })
        .catch(err => {console.log(err)})
    
    
    
    
    // GSheetReader(options, results => {
    //     console.log('hello');
    //     console.log(results);
    // }).catch(err => {
    //     console.log(err);
    // })
    
    // res.send({
    //     test: 'test working'
    // })
}