const nodemailer = require("nodemailer");

const sendEmailVoucher = (emailData) =>{
    return new Promise(async(resolve, reject) =>{
        try{

            const testAccount = await nodemailer.createTestAccount();

            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                }
            });

            const info = await transporter.sendMail({
                from: 'test voucher <text.voucher@happypuppy.id>',
                to: 'doha39anilham@gmail.com',
                bcc: 'ilham.dohaan@happypuppy.id',
                subject: 'send voucher',
                text: 'your voucher'
            });
        }catch(err){

        }
    });
}

module.exports = {
    sendEmailVoucher
}