const nodemailer = require("nodemailer");
require('dotenv').config();
const {getFileNameData, updateEmailedMasterVoucher, updateEmailedMasterEmail, getEmailAddress} = require('../model/voucher-data');
const fs = require('fs');

const sendEmailVoucher = (emailId) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            
            const emailHost = process.env.EMAIL_HOST;
            const emaiSender = process.env.EMAIL_SENDER;
            const emailPassword = process.env.EMAIL_PASS;
            const emailReceiver = await getEmailAddress(emailId);
            console.log('emailnyaa ',JSON.stringify(emailReceiver))
            const transporter = nodemailer.createTransport({
                host: emailHost,
                port: 587,
                secure: false,
                auth: {
                    user: emaiSender,
                    pass: emailPassword,
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
                to: emailReceiver.email,
                bcc: emailReceiver.email_bcc,
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