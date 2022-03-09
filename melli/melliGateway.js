const moment = require('moment');
const helper = require('./helper');
const MESSAGES = require('./codes');

module.exports = {
  request: (amount, config) => {
    return new Promise((resolve, reject) => {
      let Amount = config.currencyIsToman ? amount * 10 : amount;
      let orderId = Number(moment().format('YMMDDHHmmSS'));
      let signData = helper.signingData(
        `${config.credentail.TerminalId};${orderId};${Amount}`,
        config.credentail.TerminalKey
      );
      let param = {
        TerminalId: config.credentail.TerminalId,
        MerchantId: config.credentail.MerchantId,
        Amount: Amount,
        SignData: signData,
        ReturnUrl: config.callbackUrl,
        LocalDateTime: moment().format('M/D/Y h:m:s a'),
        OrderId: orderId,
      };
      helper
        .requestPayment(param)
        .then(({data}) => {
          resolve({
            success: data.ResCode == 0,
            message: data.Description,//MESSAGES.PaymentRequest[data.ResCode],
            ...data,
          });
        })
        .catch((error) => reject(error));
    });
  },

  verify: (token, config) => {
    return new Promise((resolve, reject) => {
      let param = {
        Token: token,
        SignData: helper.signingData(token, config.credentail.TerminalKey),
      };
      helper
        .verifyPayment(param)
        .then(({data}) => {
          resolve({
            success: data.ResCode == 0,
            message: data.Description,//MESSAGES.Verify[data.ResCode],
            ...data,
          });
        })
        .catch((error) => reject(error));
    });
  },

  refund: (param, config) => {
    return new Promise((resolve, reject) => {
      let Amount = config.currencyIsToman ? param.amount * 10 : param.amount;
      let RefundAmount = config.currencyIsToman
        ? param.refundAmount * 10
        : param.refundAmount;
      let signData = helper.signingData(
        `${param.retrivalRef};${Amount};${config.credentail.TerminalId};${param.systemTraceNo};${RefundAmount};${param.token}`,
        config.credentail.TerminalKey
      );
      let regParam = {
        RetrievalRefNo: param.retrivalRefNo,
        Amount: Amount,
        TerminalId: config.credentail.TerminalId,
        SystemTraceNo: param.systemTraceNo,
        RefundAmount: RefundAmount,
        Token: param.token,
        SignData: signData,
      };

      helper
        .registerRefund(regParam)
        .then(({data}) => {
          if (data.ResponseCode == 1010) {
            let nextSignData = helper.signingData(
              `${data.RefundId}`,
              config.credentail.TerminalKey
            );
            let nextData = {
              RefundId: data.RefundId,
              SignData: nextSignData,
            };
            helper
              .confirmRefund(nextData)
              .then((result) => {
                if (result.data && result.data.ResponseCode == 1010) {
                  return resolve({
                    success: true,
                    message: result.data.ResponseMessage,
                    ...result,
                  });
                } else {
                  helper
                    .cancelRefund(nextData)
                    .then((nextResult) => {
                      return resolve({
                        success: true,
                        message: nextResult.data.ResponseMessage,
                        ...nextResult.data,
                      });
                    })
                    .catch((error) => reject(error));
                }
              })
              .catch((error) => reject(error));
          }
          else {
            return resolve({
              success: false,
              message: data.ResponseMessage,
              ...data,
            });
          }
        })
        .catch((error) => reject(error));
    });
  },
};
