import * as csv from 'csvtojson';
import fetch from 'node-fetch';

export default async ({query: {email}}, res) => {    
    const getSheetData = () => {
        return new Promise((resolve, reject) => {
            fetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vS0ayM3oqWsPU1sSnSWBsn9YNL8nWrwA6jOwCu4Z-z7ADyHADcrN2LFxiSLMydGnzzUpQ9iJjWDSQxh/pub?output=csv`)
            .then(response => response.text())
            .then(async (data) => {
                csv.default({
                    noheader: true,
                    output: "csv"
                })
                .fromString(data)
                .then((csvRow)=>{ 
                    console.log(csvRow[0])
                    const l = csvRow.length;
                    const lel = csvRow.slice(0, l);
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
    
    Array.prototype.convertToObject = function () {
        const [timestamp, email, name, method, address, timeslot, ownBox, readyKids, readyAdult, portionSmall, portionBig, toppingCheese, toppingParmezan, toppingBacon] = this;
        return {
            timestamp: timestamp,
            email: email,
            name: name,
            method: method,
            address: address,
            timeslot: timeslot,
            order: {
                ownBox: ownBox,
                readyToEat: {
                    kids: parseFloat(readyKids),
                    adult: parseFloat(readyAdult)
                },
                sauce: {
                    small: parseFloat(portionSmall),
                    bigg: parseFloat(portionBig),
                },
                toppings: {
                    cheese: toppingCheese,
                    parmezan: toppingParmezan,
                    bacon: toppingBacon
                }
            }
        }
    }
    
    if (email) {
        const data = await getRecordByEmail(email);
        const readable = data.map(order => order.convertToObject());
        res.send(readable);
    } else {
        res.send({
            error: 'email was undefined'
        })
    }
    
}