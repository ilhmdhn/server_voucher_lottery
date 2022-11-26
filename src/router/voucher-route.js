const express = require("express");
const {postVoucher} = require('../controller/voucher-controller');
const voucherRoute = express.Router();

voucherRoute.post('/voucher', postVoucher);

module.exports = voucherRoute;