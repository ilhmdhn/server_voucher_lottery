const express = require("express");
const {postVoucher, postMassVoucher} = require('../controller/voucher-controller');
const voucherRoute = express.Router();

voucherRoute.post('/voucher', postVoucher);
voucherRoute.post('/voucher-mass', postMassVoucher);

module.exports = voucherRoute;