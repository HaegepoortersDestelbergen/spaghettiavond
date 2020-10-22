import * as csv from 'csvtojson';
import fetch from 'node-fetch';

export default async (req, res) => {
    console.log(req)
    
    fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRAMUFYniXHfMzwlr7Ir6U113p1XgXpQt4F1YP_Y0fUUANBx74Aga1rkMjBM9GlD47vx3GHWr6JRI-y/pub?output=csv`)
    .then(resp => resp.text())
    .then(async (data) => {
        console.log(data);
        csv.default({
            noheader: true,
            output: "csv"
        })
        .fromString(data)
        .then((csvRow)=>{ 
            const l = csvRow.length;
            const lel = csvRow.slice(3, l);
            res.send(lel);
        })
    })
    .catch(err => {res.send(err)})
}