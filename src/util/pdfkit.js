const PDFDocument = require('pdfkit');
const fs = require('fs');
const {insertFileNameData} = require('../model/voucher-data');

const generatePdf = (voucherCode, emailId) =>{
    return new Promise(async(resolve, reject) =>{
        try{
            const doc = new PDFDocument({size: 'A7', layout: 'landscape', margin:0})
            doc.pipe(fs.createWriteStream(__dirname+`../../../storage/voucherpdf/${voucherCode}.pdf`))
            doc
               .image(fs.readFileSync(__dirname+'../../assets/wave.jpg'),{width: 297.64, height: 100})
                .fontSize(16)
                .text('Voucher Kamu',{
                    align: 'center'
                })
                .text(voucherCode,{
                    align: 'center'
                })
                .end();
                console.log('success create pdf '+voucherCode);
                await insertFileNameData(voucherCode+'.pdf', emailId);
                resolve(true);
        }catch(err){
            console.log('failed create pdf');
            reject(`generatePdf\n${err}`);
        }
    }); 
}

module.exports = generatePdf;