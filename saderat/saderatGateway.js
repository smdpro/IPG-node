const moment = require('moment');
const helper = require('./helper');
const MESSAGES = require('./codes');

module.exports = {
  request: (amount, config,payload='') => {
    return new Promise((resolve, reject) => {
      let _amount = config.currencyIsToman ? amount * 10 : amount;
      let invoiceID = Number(moment().format('YMMDDHHmmSS'));
      
      let param = {
        terminalID: config.credentail.terminalID,
        amount:_amount,
        callbackURL: config.callbackUrl,
        invoiceID,
        payload
      };
      helper
        .requestPayment(param)
        .then(({data}) => {
          resolve({
            success: data.Status == 0,
            ...data,
          });
        })
        .catch((error) => reject(error));
    });
  },

  verify: (token, config) => {
    return new Promise((resolve, reject) => {
      let param = {
        digitalreceipt: token,//param.digitalreceipt,
        terminalID: config.credentail.terminalID,
      };
      helper
        .verifyPayment(param)
        .then(({data}) => {
          resolve({
            success: data.Status == 0,
            ...data,
          });
        })
        .catch((error) => reject(error));
    });
  },

  // refund: (param, config) => {
  //   return new Promise((resolve, reject) => {
      
      
  //   });
  // },
};
