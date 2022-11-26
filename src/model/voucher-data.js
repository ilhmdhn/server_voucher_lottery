const {mysqlConfig} = require('../util/database-tool');
const logger = require('../util/logger');

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
                    guest_email,
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
                    resolve(false);
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

module.exports = {
    insertVoucherData
}