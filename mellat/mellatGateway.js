const moment = require('moment');
const MESSAGES = require('./code');
const helper = require('./helper');

module.exports = {
  request: (amount, config, additionalData = '') =>
    new Promise((resolve, reject) => {
      let params = {
        ...config.credentail,
        orderId: moment().format('YMMDDHHmmSS'),
        amount: config.amountIsToman ? amount * 10 : amount,
        localDate: moment().format('YYMMDD'),
        localTime: moment().format('HHmmSS'),
        additionalData: additionalData,
        callBackUrl: config.callbackUrl,
        payerId: '0',
      };
      helper
        .client()
        .then((client)=> {
          client.bpPayRequest(
            params,
            (err, data) => {
              if (err) return reject(err);
              var res = data.return.split(',');
              if (res[0] != 0) return reject({
                success: false,
                ResCode: res[0],
                message: MESSAGES[res[0]],
              });
              resolve({success:true, ResCode: res[0], RefId: res[1] });
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
          client.bpVerifyRequest(params, function (error, result) {
            if (error) return reject(error);
            if (result.return != 0) {
              helper.reverse(params.saleOrderId, params.saleReferenceId);
              return resolve({ message: result.return });
            }
            helper
              .inquiry(params.saleOrderId, params.saleReferenceId)
              .then((data) => {
                if (data.success) {
                  helper
                    .settle(params.saleOrderId, params.saleReferenceId)
                    .then((data) => {
                      if (data.success) return resolve({ success: true });
                      helper.reverse(
                        params.saleOrderId,
                        params.saleReferenceId
                      );
                      resolve({ message: data.err });
                    })
                    .catch((e) => {
                      helper.reverse(
                        params.saleOrderId,
                        params.saleReferenceId
                      );
                      reject({ message: e });
                    });
                } else {
                  helper.reverse(params.saleOrderId, params.saleReferenceId);
                  return resolve({ message: data.err });
                }
              })
              .catch((e) => {
                helper.reverse(params.saleOrderId, params.saleReferenceId);
                return reject({ message: e });
              });
          });
        })
        .catch(function (err) {
          helper.reverse(params.saleOrderId, params.saleReferenceId);
          return reject({ message: err });
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
              code: res[0],
              TransactionCode: res[1],
            });
            
          });
        })
        .catch((error) => reject(error));
    }),
};
