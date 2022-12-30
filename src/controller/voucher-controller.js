const {insertVoucherData, insertEmailData, checkInvoiceIsGenerated, voucherHistory, checkFailedVoucher} = require('../model/voucher-data');
const {generateVoucherCode, generateEmailId} = require('../util/code');
const response = require('../util/response');
const logger = require('../util/logger');
const generatePdf = require('../util/pdfkit');
const sendEmailVoucher = require('../util/email');

const postVoucher = async(req, res) =>{
    try{
        const voucher_code_temp = req.body.voucher_code_temp;
        const outlet_code = req.body.outlet_code;
        const invoice_code = req.body.invoice_code;
        const guest_name = req.body.guest_name;
        const guest_instagram = req.body.guest_instagram;
        const guest_phone = req.body.guest_phone;
        const guest_email = req.body.guest_email;
        const full_outlet_code = req.body.full_outlet_code;
        const guest_ktp = req.body.guest_ktp;
        const guest_charge = req.body.guest_charge;
        const transaction_date = req.body.transaction_date;
        
        const canUpload = await checkInvoiceIsGenerated(full_outlet_code, invoice_code);
        const failedVoucher = await checkFailedVoucher(full_outlet_code, invoice_code);

        if(canUpload == false){
            res.send(response(false, null, 'Invoice sudah pernah digunakan'));
            return
        }

        const email_id = await generateEmailId();
        await insertEmailData(email_id,guest_email, full_outlet_code, invoice_code)
        
        let guestChargeTemp = guest_charge;
        do{
            const voucher_code = await generateVoucherCode(voucher_code_temp)
            const voucherData = {
                voucherCode: voucher_code,
                outletCode: full_outlet_code,
                invoiceCode: invoice_code,
                guestName: guest_name,
                guestInstagram: guest_instagram,
                guestPhone: guest_phone,
                guestEmail: email_id,
                guestKtp: guest_ktp,
                guestCharge: guest_charge,
                transactionDate: transaction_date
            }
            await insertVoucherData(voucherData);
            await generatePdf(voucher_code, email_id);
            guestChargeTemp = guestChargeTemp - 100000;
        }while(guestChargeTemp >= 100000)
        const emailed = await sendEmailVoucher(email_id)
        if(emailed != true){
            throw emailed;
        }
        res.send(response(true, null, 'Success Add Voucher'));

    }catch(err){
        logger.error(`postVoucher ${err}`);
        res.send(response(false, null, 'error'));
    }
}

const postMassVoucher = async(req, res)=>{
    try{
        const voucherData = req.body.voucher;

        // if(voucherData.length<1){
        //     res.send(response(false, null, 'Format tidak didukung atau data kosong'));
        // }

        for(let i=0; i<voucherData.length; i++){
            const voucher_code_temp = voucherData[i].voucher_code_temp;
            const invoice_code = voucherData[i].invoice_code;
            const guest_name = voucherData[i].guest_name;
            const guest_instagram = voucherData[i].guest_instagram;
            const guest_phone = voucherData[i].guest_phone;
            const guest_email = voucherData[i].guest_email;
            const full_outlet_code = voucherData[i].full_outlet_code;
            const guest_ktp = voucherData[i].guest_ktp;
            const guest_charge = voucherData[i].guest_charge;
            const transaction_date = voucherData[i].transaction_date;

            const canUpload = await checkInvoiceIsGenerated(full_outlet_code, invoice_code);
            const failedVoucher = await checkFailedVoucher(full_outlet_code, invoice_code);
            if(canUpload == false){
                continue;
            }
            const email_id = await generateEmailId();
            await insertEmailData(email_id,guest_email, full_outlet_code, invoice_code)
            let guestChargeTemp = guest_charge;

            do{
                const voucher_code = await generateVoucherCode(voucher_code_temp)
                const voucherData = {
                    voucherCode: voucher_code,
                    outletCode: full_outlet_code,
                    invoiceCode: invoice_code,
                    guestName: guest_name,
                    guestInstagram: guest_instagram,
                    guestPhone: guest_phone,
                    guestEmail: email_id,
                    guestKtp: guest_ktp,
                    guestCharge: guest_charge,
                    transactionDate: transaction_date
                }
                await insertVoucherData(voucherData);
                await generatePdf(voucher_code, email_id);
                guestChargeTemp = guestChargeTemp - 100000;
            }while(guestChargeTemp >= 100000)

            sendEmailVoucher(email_id);
        }
        res.send(response(true, null,'Success insert all voucher'));
    }catch(err){
        logger.error(`postVoucher ${err}`);
        res.send(response(false, null, 'error'));
    }
}

const getVoucherHistory = async(req, res)=>{
    try{
        const page = req.query.page;
        const size = req.query.size;
        const outlet = req.query.outlet_code;

        const historyData = await voucherHistory(page, size, outlet)

        res.send(historyData);
    }catch(err){
        logger.error(`getVoucherHistory\n${err}`);
        res.send(response(false, null, 'error'));
    }
}

module.exports = {
    postVoucher,
    postMassVoucher,
    getVoucherHistory
}