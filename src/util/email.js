const nodemailer = require("nodemailer");
require('dotenv').config();
const {getFileNameData, updateEmailedMasterVoucher, updateEmailedMasterEmail} = require('../model/voucher-data');
const fs = require('fs');

const sendEmailVoucher = (emailId) =>{
    return new Promise(async(resolve, reject) =>{
        try{

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_SENDER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false
                  },
                  logger: true,
                  debug: false,
                  secure: false, 
            });

            const pdfFile = await getFileNameData(emailId);

            const attachments = pdfFile.map((file)=>{
                return { filename: file.file_name, content: fs.createReadStream(__dirname+'../../../storage/voucherpdf/'+file.file_name)};
              });

            const info = await transporter.sendMail({
                from: `Voucher Received<${process.env.EMAIL_SENDER}>`,
                to: 'doha39anilham@gmail.com',
                bcc: 'ilham.dohaan@happypuppy.id',
                subject: 'VOUCHER Happy Puppy (TEST)',
                text: '(TEST)\nTerima kasih telah mengunjungi happy puppy ,\nKamu berhak mendapatkan voucher',
                attachments: attachments
            });
            
            updateEmailedMasterVoucher(emailId)
            updateEmailedMasterEmail(emailId)
            resolve(true);
        }catch(err){
            reject(`sendEmailVoucher ${err}`);
        }
    });
}

module.exports = sendEmailVoucher;