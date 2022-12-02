const {mysqlConfig} = require('./database-tool');
const moment = require('moment');
const logger = require('../util/logger');

const generateVoucherCode = (voucherData) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            const todayVoucher = await getTotalVoucherToday(voucherData);
            const totalVoucherToday = (todayVoucher+1).toString().padStart(5, '0');
            resolve(voucherData+totalVoucherToday);
        }catch(err){
            logger.error('generateVoucherCode '+ err);
            reject(`generateVoucherCode ${err}`);
        }
    });
}

const getTotalVoucherToday = (voucher) =>{
    return new Promise(async(resolve, reject) =>{
        try{

            const query = `
            SELECT count(*) as total FROM MasterVoucher WHERE voucher_code LIKE '${voucher}%'
            `
            const mysql = await mysqlConfig();
            mysql.connect((err)=>{
                if(err){
                    logger.error(`Can't connect to databases ${err}`);
                    resolve(false);
                }else{
                    mysql.query(query, (err, results) =>{
                        if(err){
                            logger.error(`getTotalVoucherToday query ${err} \n${query}`);
                            reject(`getTotalVoucherToday ${err}`);
                        }else{
                            resolve(results[0].total);
                        }
                        mysql.end();
                    });
                }
            });
        }catch(err){
            logger.error('getTotalVoucherToday '+ err);
            reject(`getTotalVoucherToday ${err}`);
        }
    });
}

const generateEmailId = () =>{
    return new Promise(async(resolve, reject)=>{
        try{

            const date = moment().format('YYMMDD');

            const sendTotalEmailToday = await getTotalEmailToday(date);
            const emailId = date + (sendTotalEmailToday+1).toString().padStart(5, '0')
            resolve(emailId);
        }catch(err){
            reject(`generateEmailId ${err}`);
        }
    })
}

const getTotalEmailToday = (date) =>{
    return new Promise(async(resolve, reject) =>{
        try{

            const query = `
            SELECT count(*) as total FROM MasterEmail WHERE email_id LIKE '${date}%'
            `

            const mysql = await mysqlConfig();
            mysql.connect((err)=>{
                if(err){
                    reject(`Can't connect to databases ${err}`)
                }else{
                    mysql.query(query, (err, result) =>{
                        if(err){
                            reject(`getTotalEmailToday query \n${err}\n${query}`);
                        }else{
                            resolve(result[0].total)
                        }
                        mysql.end();
                    });
                }
            });
        }catch(err){
            reject(`getTotalEmailToday ${err}`);
        }
    })
}

module.exports = {
    generateVoucherCode,
    generateEmailId
}