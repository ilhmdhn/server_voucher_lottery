const { insertFileNameData } = require('../model/voucher-data');
const muhammara = require('muhammara');

const generatePdf = (voucherCode, emailId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const pdfFile = muhammara.createWriterToModify(
                __dirname + '/designVoucher.pdf', {
                modifiedFilePath: __dirname + `../../../storage/voucherpdf/${voucherCode}.pdf`,
            }
            );

            const pageModifier = new muhammara.PDFPageModifier(pdfFile, 0);
            pageModifier
                .startContext()
                .getContext()
                .writeText(voucherCode, 300, 46, {
                    font: pdfFile.getFontForFile(
                        __dirname + "/robotto.ttf"
                    ),
                    size: 25,
                    colorspace: "black",
                    color: 0x00,
                })
            pageModifier.endContext().writePage();
            pdfFile.end();
            console.log('success create pdf ' + voucherCode);
            await insertFileNameData(voucherCode + '.pdf', emailId);
            resolve(true);
        } catch (err) {
            console.log('failed create pdf');
            reject(`generatePdf\n${err}`);
        }
    });
}

module.exports = generatePdf;