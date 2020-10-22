import * as csv from 'csvtojson';
import fetch from 'node-fetch';

export default async ({query: {email}}, res) => {    
    const getSheetData = () => {
        return new Promise((resolve, reject) => {
            fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vRAMUFYniXHfMzwlr7Ir6U113p1XgXpQt4F1YP_Y0fUUANBx74Aga1rkMjBM9GlD47vx3GHWr6JRI-y/pub?output=csv`)
            .then(response => response.text())
            .then(async (data) => {
                csv.default({
                    noheader: true,
                    output: "csv"
                })
                .fromString(data)
                .then((csvRow)=>{ 
                    const l = csvRow.length;
                    const lel = csvRow.slice(3, l);
                    resolve(lel)
                })
            })
            .catch(err => {
                reject(err);
            })
        })
    }
    
    const getRecordByEmail = async (email) => {
        const data = await getSheetData();
        return await data.filter((r) => r[1] == email);
    }
    
    if (email) {
        const data = await getRecordByEmail(email);
        res.send(data);
    } else {
        res.send({
            error: 'email was undefined'
        })
    }
    
}