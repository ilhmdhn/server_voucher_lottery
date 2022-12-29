const { mysqlConfig } = require('../util/database-tool');
const logger = require('../util/logger');
const response = require('../util/response');
require('dotenv').config();

const insertEmailData = (id, email, outletCode, invoice) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
            INSERT INTO master_email(
                email_id,
                email_address,
                outlet_code,
                status,
                date,
                invoice
            )VALUES(
                '${id}',
                '${email}',
                '${outletCode}',
                '0',
                CURRENT_TIMESTAMP(),
                '${invoice}'
            )
            `
            const mysql = await mysqlConfig();
            mysql.connect((err) => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    mysql.query(query, (err, results) => {
                        if (err) {
                            reject(`insertEmailData query \n${err}\n${query}`);
                        } else {
                            resolve(true);
                        }
                        mysql.end();
                    });
                }
            });
        } catch (err) {
            reject(`insertEmailData \n${err}`);
        }
    });
}

const insertVoucherData = (voucherData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
            INSERT INTO master_voucher(
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
            mysql.connect((err) => {
                if (err) {
                    logger.error(`Can't connect to databases ${err}`);
                    reject(false);
                } else {
                    mysql.query(query, (err, results) => {
                        if (err) {
                            logger.error(`getMemberData query ${err}`);
                            reject(false);
                        } else {
                            logger.info(`SUCCESS INSERT Voucher ${voucherData.voucherCode}`)
                            resolve(true);
                        }
                        mysql.end();
                    });
                }
            });
        } catch (err) {
            logger.error(`insertVoucherData ${err}`);
            reject(false);
        }
    });
}

const insertFileNameData = (file_name, email_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
            INSERT INTO master_file(
                file_name,
                email_id
            )VALUES(
                '${file_name}',
                '${email_id}'
            )
            `

            const mysql = await mysqlConfig();
            mysql.connect((err) => {
                if (err) {
                    reject(`Can't connect to database ${err}`);
                } else {
                    mysql.query(query, (err, result) => {
                        if (err) {
                            reject(`insertFileNameData query \n${err}\n${query}`);
                        } else {
                            resolve(true)
                        }
                        mysql.end();
                    });
                }
            });
        } catch (err) {
            reject(`insertFileNameData ${err}`)
        }
    });
}

const getFileNameData = (email_id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
            SELECT file_name FROM master_file WHERE email_id = '${email_id}'
            `

            const mysql = await mysqlConfig();
            mysql.connect((err) => {
                if (err) {
                    reject(`Can't connect to database\n${err}`);
                } else {
                    mysql.query(query, (err, results, fields) => {
                        if (err) {
                            reject(`getFileNameData query\n${err}\n${query}`);
                        } else {
                            if (results.length > 0) {
                                resolve(results)
                            } else {
                                resolve(false);
                            }
                        }
                        mysql.end();
                    });
                }
            });
        } catch (err) {
            reject(`getFileNameData${err}`);
        }
    })
}

const updateEmailedMasterVoucher = async (email_id, state) => {
    try {
        const query = `
            UPDATE master_email SET status = '${state}' WHERE email_id = '${email_id}'
        `
        const mysql = await mysqlConfig();
        mysql.connect((err) => {
            if (err) {
                throw `Can't connect to database\n${err}`
            } else {
                mysql.query(query, (err, results, fields) => {
                    if (err) {
                        throw `updateEmailedMasterVoucher query\n${err}\n${query}`
                    } else {
                        logger.info(`SUCCESS updateEmailedMasterVoucher ${email_id}`)
                    }
                    mysql.end();
                });
            }
        });
    } catch (err) {
        logger.error(err);
    }
}

const updateEmailedmaster_email = async (email_id, state) => {
    try {
        const query = `
            UPDATE master_voucher SET status = '${state}' WHERE email_id = '${email_id}'
        `
        const mysql = await mysqlConfig();
        mysql.connect((err) => {
            if (err) {
                throw `Can't connect to database\n${err}`
            } else {
                mysql.query(query, (err, results, fields) => {
                    if (err) {
                        throw `getFileNameData query\n${err}\n${query}`
                    } else {
                        logger.info(`SUCCESS updateEmailedmaster_email ${email_id}`)
                    }
                    mysql.end();
                });
            }
        });
    } catch (err) {
        logger.error(err);
    }
}

const checkInvoiceIsGenerated = (outlet_code, invoice) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
                SELECT COUNT(*) as total FROM master_voucher WHERE outlet_code = '${outlet_code}' AND invoice_code = '${invoice}'
            `
            const mysql = await mysqlConfig();
            mysql.connect((err) => {
                if (err) {
                    reject(`Can't connect to database\n${err}`);
                } else {
                    mysql.query(query, (err, results) => {
                        if (err) {
                            reject(`checkInvoiceIsGenerated query\n${err}\n${query}`);
                        } else {
                            if (results[0].total > 0) {
                                resolve(false)
                            } else {
                                resolve(true)
                            }
                        }
                        mysql.end();
                    });
                }
            });
        } catch (err) {
            reject(`checkInvoiceIsGenerated \n${err}`);
        }
    });
}

const getEmailAddress = (emailId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
                SELECT email_address as email, outlet_code as kode_outlet FROM master_email WHERE email_id = '${emailId}'
            `
            const mysql = await mysqlConfig();
            mysql.connect((err) => {
                if (err) {
                    reject(`Can't connect to database\n${err}`);
                } else {
                    mysql.query(query, (err, results) => {
                        if (err) {
                            reject(`getEmailAddress query\n${err}\n${query}`);
                        } else {
                            console.log('hasil query email ', JSON.stringify(results))
                            if (results.length > 0) {
                                resolve(results[0])
                            } else {
                                resolve(false)
                            }
                        }
                        mysql.end();
                    });
                }
            });
        } catch (err) {
            reject(`getEmailAddress ${err}`)
        }
    })
}

const voucherHistory = (page, size, outlet) => {
    return new Promise(async(resolve, reject) => {
        try {
            const query = `
            SELECT * FROM master_email WHERE outlet_code = '${outlet}' ORDER BY date DESC LIMIT ${size} OFFSET ${(page-1)*size}`
            const mysql = await mysqlConfig();
            mysql.connect((err) => {
                if (err) {
                    reject(`Can't connect to database\n${err}`);
                } else {
                    mysql.query(query, (err, results) => {
                        if (err) {
                            reject(`voucherHistory query\n${err}\n${query}`);
                        } else {
                            if (results.length > 0) {
                                resolve(response(true, results))
                            } else {
                                resolve(response(false, [], 'Data Kosong'))
                            }
                        }
                        mysql.end();
                    });
                }
                });
        } catch (err) {
            logger.error(`voucherHistory\n`+err)
            reject(err)
        }
    });
}

module.exports = {
    insertVoucherData,
    insertEmailData,
    insertFileNameData,
    getFileNameData,
    updateEmailedMasterVoucher,
    updateEmailedmaster_email,
    checkInvoiceIsGenerated,
    getEmailAddress,
    voucherHistory
}