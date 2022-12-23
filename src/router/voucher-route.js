const express = require("express");
const {postVoucher, postMassVoucher, getVoucherHistory} = require('../controller/voucher-controller');
const voucherRoute = express.Router();

voucherRoute.post('/voucher', postVoucher);
voucherRoute.post('/voucher-mass', postMassVoucher);
voucherRoute.get('/voucher-history', getVoucherHistory)

module.exports = voucherRoute;