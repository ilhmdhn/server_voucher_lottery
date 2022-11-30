const {mysqlConfig} = require('../util/database-tool');
const logger = require('../util/logger');

const insertEmailData = (id, email)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `
            INSERT INTO MasterEmail(
                EmailId,
                Email_Address,
                Status,
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

const insertFileNameData = (fileData) =>{
    return new Promise(async(resolve, reject)=>{
        try{
            const query = `
            INSERT INTO MasterFile(
                file_name,
                email_id
            )VALUES(
                '${fileData.file_name}',
                '${fileData.email_id}'
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

module.exports = {
    insertVoucherData,
    insertEmailData,
    insertFileNameData
}