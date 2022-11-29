const express = require("express");
const app = express();
require('dotenv').config();
const {databaseTest} = require('./util/database-tool');
const bodyParser = require('body-parser');
const logger = require('../src/util/logger');
const port = process.env.PORT;

// import router
const voucherRoute = require('./router/voucher-route');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader;
    if (token == null) return res.sendStatus(401)

    if (token == process.env.ZENVIVA_PASSWORD){
        next()
    }else{
        res.sendStatus(401)
        return res.json({
            state: false,
            data: null,
            message: 'unauth'});
    }
}

const loggerRequest = (req, res, next) =>{
    logger.info(`Receive request ${req.method} ${req.originalUrl}`)
    next()
}

app.listen(port, async()=>{
    logger.info(`App Running on ${process.env.PORT} port`);
})

app.get('/', async (req, res)=>{
    const connection = await databaseTest()
    res.json({
        state: connection
    });
})
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({extended: true}));
app.use(loggerRequest)
app.use(authenticateToken);
//use router
app.use(voucherRoute);