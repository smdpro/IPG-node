const moment = require('moment');
const MESSAGES = require('./code');
const helper = require('./helper');

module.exports = {
  request: (amount, config, additionalData = '') =>
    new Promise((resolve, reject) => {
      let params = {
        ...config.credentail,
        orderId: moment().format('YMMDDHHmmSS'),
        amount: config.currencyIsToman ? amount * 10 : amount,
        localDate: moment().format('YYMMDD'),
        localTime: moment().format('HHmmSS'),
        additionalData: additionalData,
        callBackUrl: config.callbackUrl,
        payerId: '0',
      };
      helper
        .client()
        .then((client) => {
          client.bpPayRequest(
            params,
            (error, data) => {
              if (error) return reject(error);
              let res = data.return.split(',');
              resolve({
                success: res[0] == 0,
                message: res[0] != 0 ? MESSAGES[res[0]] : undefined,
                ResCode: res[0],
                RefId: res[0] == 0 ? res[1] : undefined,
              });
            },
            { ignoredNamespaces: { namespaces: [], override: true } }
          );
        })
        .catch((error) => reject(error));
    }),

  verify: (param, config) =>
    new Promise((resolve, reject) => {
      let params = {
        ...config.credentail,
        orderId: param.orderId,
        saleOrderId: param.saleOrderId,
        saleReferenceId: param.saleReferenceId,
      };
      helper
        .client()
        .then((client) => {
          client.bpVerifyRequest(params, (error, result) => {
            if (error) return reject(error);
            if (result.return != 0) {
              helper.reverse(params);
              return resolve({ message: result.return });
            }
            helper
              .inquiry(params)
              .then((data) => {
                if (!data.success) {
                  helper.reverse(params);
                  return resolve({ message: data.message });
                }
                helper
                  .settle(params)
                  .then((data) => {
                    if (data.success) return resolve({ success: true });
                    helper.reverse(params);
                  })
                  .catch((error) => {
                    helper.reverse(params);
                    reject({ message: error });
                  });
              })
              .catch((error) => {
                helper.reverse(params);
                return reject(error);
              });
          });
        })
        .catch((error) => {
          helper.reverse(params);
          return reject(error);
        });
    }),

  refund: (param, config) =>
    new Promise((resolve, reject) => {
      let params = {
        ...config.credentail,
        orderId: param.orderId,
        saleOrderId: param.saleOrderId,
        saleReferenceId: param.saleReferenceId,
        refundAmount: param.refundAmount,
      };
      helper
        .client()
        .then((client) => {
          client.bpRefundRequest(params, function (error, result) {
            if (error) return reject(error);
            var res = result.return.split(',');
            resolve({
              success: res[0] == 0,
              message: result.return,
              ResCode: res[0],
              TransactionCode: res[1],
            });
          });
        })
        .catch((error) => reject(error));
    }),
};
