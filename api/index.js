// import * as csv from 'csvtojson';
import fetch from 'node-fetch';

export default async (req, res) => {
    console.log(req)
    const prom = () => {
        return new Promise((resolve, reject) => {
            fetch(`https://api.allorigins.win/get?url=https://raw.githubusercontent.com/lennertderyck/photo-sorter/master/package.json`, {
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            })
            .then(body => {return body.json()})
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
    
    const data = await prom();
    res.send(await data);
    
    // fetch(`https://api.allorigins.win/get?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vRAMUFYniXHfMzwlr7Ir6U113p1XgXpQt4F1YP_Y0fUUANBx74Aga1rkMjBM9GlD47vx3GHWr6JRI-y/pub?output=csv`)
    // .then(resp => resp.json())
    // .then(async ({contents}) => {
    //     csv.default({
    //         noheader: true,
    //         output: "csv"
    //     })
    //     .fromString(contents)
    //     .then((csvRow)=>{ 
    //         // const l = csvRow.length;
    //         // const lel = csvRow.slice(3, l);
    //         // res.send(lel);
    //         res.send(csvRow);
    //     })
    // })
    // .catch(err => {res.send(err)})
}