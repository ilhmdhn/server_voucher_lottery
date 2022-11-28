const {insertVoucherData} = require('../model/voucher-data');
const {generateVoucherCode} = require('../util/code');
const response = require('../util/response');
const logger = require('../util/logger');

const postVoucher = async(req, res) =>{
    try{
        const voucher_code_temp = req.body.voucher_code_temp;
        const outlet_code = req.body.outlet_code;
        const invoice_code = req.body.invoice_code;
        const guest_name = req.body.guest_name;
        const guest_instagram = req.body.guest_instagram;
        const guest_phone = req.body.guest_phone;
        const guest_email = req.body.guest_email;
        const guest_ktp = req.body.guest_ktp;
        const guest_charge = req.body.guest_charge;
        const transaction_date = req.body.transaction_date;
        
        const voucher_code = await generateVoucherCode(voucher_code_temp)

        const voucherData = {
            voucherCode: voucher_code,
            outletCode: outlet_code,
            invoiceCode: invoice_code,
            guestName: guest_name,
            guestInstagram: guest_instagram,
            guestPhone: guest_phone,
            guestEmail: guest_email,
            guestKtp: guest_ktp,
            guestCharge: guest_charge,
            transactionDate: transaction_date
        }

        console.log('voucher data '+JSON.stringify(voucherData));

//        await insertVoucherData(voucherData);
        res.send(response(true, null, 'Success Add Voucher'));

    }catch(err){
        logger.error(`postVoucher ${err}`);
        res.send(response(false, null, 'error'));
    }
}

module.exports = {
    postVoucher
}