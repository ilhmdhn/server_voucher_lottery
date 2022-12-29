const fs = require('fs');
const logger = require('./logger');

const createStoregeDir = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const dir = __dirname+'../../../storage/voucherpdf';

            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir, {recursive: true});
                logger.info('Success create pdf directory');
            }else{
                logger.info('pdf directory already exist');
            }
            resolve(true)
        } catch (err) {
            logger.error('Failed create pdf directory\n'+err);
            resolve(true);
        }
    });
}

module.exports = {createStoregeDir};