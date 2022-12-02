const mysql = require('mysql');
const logger  = require('../util/logger');
const response = require('../util/response');
require('dotenv').config();

const mysqlConfig = () =>{
    return new Promise((resolve, reject)=>{
        try{
            const mysqlConfig = mysql.createConnection({
                host     : process.env.DATABASE_SERVER,
                user     : process.env.DATABASE_USER,
                password : process.env.DATABASE_PASSWORD,
                database : process.env.DATABASE_NAME
            });
            resolve(mysqlConfig);
        }catch(err){
            reject(err);
        }
    });
}

const databaseTest = () =>{
    return new Promise(async(resolve)=>{
        try{            
            const mysql = await mysqlConfig();
            mysql.connect((err)=>{
                if(err){
                    resolve(response(false, null, err));
                    logger.error(`Connect Database \n
                    server: ${process.env.DATABASE_SERVER}
                    user: ${process.env.DATABASE_USER}
                    message: ${err}`)
                }else{
                    resolve(true);
                }
                mysql.end();
            });
        }catch(err){
            resolve('error '+err)
        }
    })
}

module.exports = {
    mysqlConfig,
    databaseTest
};