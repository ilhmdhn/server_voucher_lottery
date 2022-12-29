const nodemailer = require("nodemailer");
require('dotenv').config();
const {getFileNameData, updateEmailedMasterVoucher, updateEmailedMasterEmail, getEmailAddress} = require('../model/voucher-data');
const fs = require('fs');
const logger = require("./logger");

const sendEmailVoucher = (emailId) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            
            const emailHost = process.env.EMAIL_HOST;
            const emaiSender = process.env.EMAIL_SENDER;
            const emailPassword = process.env.EMAIL_PASS;
            const emailReceiver = await getEmailAddress(emailId);
            const kode_outlet = emailReceiver.kode_outlet;
            const bccOutlet = [`${kode_outlet}.spv@happypuppy.id`, 
                                `${kode_outlet}.koo@happypuppy.id`, 
                                `${kode_outlet}.akt@happypuppy.id`, 
                                `${kode_outlet}.adm@happypuppy.id`
                                // ,`${kode_outlet}.fnc@happypuppy.id`,
                                // `${kode_outlet}.ite@happypuppy.id`,
                                // `${kode_outlet}@happypuppy.id`
                            ]; 
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
                return { 
                    filename: file.file_name, 
                    content: fs.createReadStream(__dirname+'../../../storage/voucherpdf/'+file.file_name)};
              });

            const info = await transporter.sendMail({
                from: `Happy Puppy Group<${process.env.EMAIL_SENDER}>`,
                to: emailReceiver.email,
                bcc: bccOutlet,
                subject: 'Voucher Undian “Happup K-Fest”',
                html: `<p>Terima Kasih telah bernyanyi dan berpartisipasi pada "Happup K-Fest".</p>
                <p>E-voucher dapat diunduh pada lampiran ini.</p>
                <p>Pengundian dilakukan oleh tim Happy Puppy Official melalui Live IG <a href="https://www.instagram.com/happypuppykaraoke/">@happypuppykaraoke</a> dan akan
                diumumkan pada 03 Februari 2023, 03 Maret 2023 dan 08 April 2023.<p>
                <p>Terima kasih.</p>

                <p>Salam Happy People,<br>Happy Puppy Group</p>
                `,
                attachments: attachments
            });
            updateEmailedMasterVoucher(emailId, 1)
            updateEmailedMasterEmail(emailId, 1)
            resolve(true);
            logger.info(`SEND EMAIL\n${info}`);
        }catch(err){
            updateEmailedMasterVoucher(emailId, 2)
            updateEmailedMasterEmail(emailId, 2)
            resolve(err);
        }
    });
}

module.exports = sendEmailVoucher;