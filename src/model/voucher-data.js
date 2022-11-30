const {mysqlConfig} = require('../util/database-tool');
const logger = require('../util/logger');

const insertEmailData = (id, email)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `
            INSERT INTO MasterEmail(
                email_id,
                email_address,
                status,
                date
            )VALUES(
                '${id}',
                '${email}',
                '0',
                CURDATE()
            )
            `
        const mysql = await mysqlConfig();
        mysql.connect((err)=>{
            if(err){
                reject.error(`Can\'t connect to database ${err}`);
            }else{
                mysql.query(query, (err, results)=>{
                    if(err){
                        reject(`insertEmailData query \n${err}\n${query}`);
                    }else{
                        resolve(true);
                    }
                });
            }
        });
        }catch(err){
            reject(`insertEmailData \n${err}`);
        }
    });
}

const insertVoucherData = (voucherData) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `
            INSERT INTO MasterVoucher(
                    voucher_code,
                    outlet_code,
                    invoice_code,
                    guest_name,
                    guest_instagram,
                    guest_phone,
                    email_id,
                    guest_ktp,
                    guest_charge,
                    transaction_date
            )VALUES(
                '${voucherData.voucherCode}',
                '${voucherData.outletCode}',
                '${voucherData.invoiceCode}',
                '${voucherData.guestName}',
                '${voucherData.guestInstagram}',
                '${voucherData.guestPhone}',
                '${voucherData.guestEmail}',
                '${voucherData.guestKtp}',
                '${voucherData.guestCharge}',
                '${voucherData.transactionDate}'
            )
            `;

            const mysql = await mysqlConfig();
            mysql.connect((err)=>{
                if(err){
                    logger.error(`Can't connect to databases ${err}`);
                    reject(false);
                }else{
                    mysql.query(query, (err, results) =>{
                        if(err){
                            logger.error(`getMemberData query ${err}`);
                            reject(false);
                        }else{
                                logger.info(`SUCCESS INSERT Voucher ${voucherData.voucherCode}`)
                                resolve(true);
                        }
                        mysql.end();
                    });
                }
            });
        }catch(err){
            logger.error(`insertVoucherData ${err}`);
            reject(false);
        }
    });
}

const insertFileNameData = (file_name,email_id) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `
            INSERT INTO MasterFile(
                file_name,
                email_id
            )VALUES(
                '${file_name}',
                '${email_id}'
            )
            `

            const mysql = await mysqlConfig();
            mysql.connect((err)=>{
                if(err){
                    reject(`Can't connect to database ${err}`);                    
                }else{
                    mysql.query(query, (err, result)=>{
                        if(err){
                            reject(`insertFileNameData query \n${err}\n${query}`);
                        }else{
                            resolve(true)
                        }
                    })
                }
            })
        }catch(err){
            reject(`insertFileNameData ${err}`)
        }
    });
}

const getFileNameData = (email_id) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `
            SELECT file_name FROM MasterFile WHERE email_id = '${email_id}'
            `

            const mysql = await mysqlConfig();
            mysql.connect((err) =>{
                if(err){
                    reject(`getFileNameData query\n${err}`);
                }else{
                    mysql.query(query, (err, results, fields)=>{
                        if(err){
                            console.log('fill'+ fields);
                            reject(`getFileNameData query\n${err}\n${query}`);
                        }else{
                            if(results.length>0){
                                resolve(results)
                            }else{
                                resolve(false);
                            }
                        }
                    });
                }
            });
        }catch(err){
            reject(`getFileNameData${err}`);
        }
    })
}

module.exports = {
    insertVoucherData,
    insertEmailData,
    insertFileNameData,
    getFileNameData
}