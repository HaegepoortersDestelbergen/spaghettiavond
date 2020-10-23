import * as csv from 'csvtojson';
import fetch from 'node-fetch';

export default async ({query}, res) => { 
    // Getting url params
    const {email, order} = query;
    
    // Setting cors header
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
     
    // Fetch sheetdata
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
                    const orders = csvRow.slice(0, csvRow.length);
                    const converted = orders.map((order, index) => {
                        order.push(index+1);
                        return order.convertToObject();
                    })
                    resolve(converted);
                })
            })
            .catch(err => {
                reject(err);
            })
        })
    }
    
    const getRecordByEmail = async (email) => {
        const data = await getSheetData();
        return await data.filter((r) => r.email == email);
    }
    
    const getRecordByID = async (id) => {
        const data = await getSheetData();
        return await data.filter((r) => r.orderNo == id);
    }
    
    String.prototype.stringConvert = function (convertData) {
        return convertData[this];
    }
    
    Array.prototype.convertToObject = function () {
        const [timestamp, email, name, method, address, timeslot, ownBox, readyKids, readyAdult, portionSmall, portionBig, toppingCheese, toppingParmezan, toppingBacon, comment, wineWhite, wineRed, juiceOrange, juiceWorldmix, payed, orderNo] = this;

        return {
            timestamp: timestamp,
            orderNo: orderNo,
            email: email,
            name: name,
            method: method,
            address: address,
            timeslot: timeslot,
            order: {
                ownBox: ownBox == 'Ja' ? true : false,
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
                    parmezan: toppingParmezan == 'Ja' ? 1 : 0,
                    bacon: toppingBacon == 'Ja' ? 1 : 0
                },
                drinks: {
                    wineWhite: parseFloat(wineWhite),
                    wineRed: parseFloat(wineRed),
                    juiceOrange: parseFloat(juiceOrange),
                    juiceWorldmix: parseFloat(juiceWorldmix)
                }
            },
            comment: comment,
            payStatus: payed == 'FALSE' ? false : true
        }
    }
     
    if (email) {
        const data = await getRecordByEmail(email);
        res.send(data);
    } else if (order) {
        const data = await getRecordByID(order);
        res.send(data);
    } else {
        res.send({error: 'email was undefined'})
    }
}