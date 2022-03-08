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
      let data = {
        TerminalId: config.credentail.TerminalId,
        MerchantId: config.credentail.MerchantId,
        Amount: Amount,
        SignData: signData,
        ReturnUrl: config.callbackUrl,
        LocalDateTime: moment().format('M/D/Y h:m:s a'),
        OrderId: orderId,
      };
      helper
        .requestPayment(data)
        .then((result) => {
          resolve({
            success: result.ResCode == 0,
            message: MESSAGES.PaymentRequest[result.ResCode],
            ...result,
          });
        })
        .catch((error) => reject(error));
    });
  },

  verify: (token, config) => {
    return new Promise((resolve, reject) => {
      let verifyData = {
        Token: token,
        SignData: helper.signingData(token, config.credentail.TerminalKey),
      };
      helper
        .verifyPayment(verifyData)
        .then((result) => {
          resolve({
            success: result.ResCode == 0,
            message: MESSAGES.Verify[result.ResCode],
            ...result,
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
      let data = {
        RetrievalRefNo: param.retrivalRefNo,
        Amount: Amount,
        TerminalId: config.credentail.TerminalId,
        SystemTraceNo: param.systemTraceNo,
        RefundAmount: RefundAmount,
        Token: param.token,
        SignData: signData,
      };

      helper
        .registerRefund(data)
        .then((dt) => {
          if (dt && dt.ResponseCode == 1010) {
            let nextSignData = helper.signingData(
              `${dt.RefundId}`,
              config.credentail.TerminalKey
            );
            let nextData = { RefundId: dt.RefundId, SignData: nextSignData };
            helper
              .confirmRefund(nextData)
              .then((result) => {
                if (result && result.ResponseCode == 1010) {
                  return resolve({
                    success: true,
                    message: MESSAGES.refund[result.ResponseCode],
                    ...result,
                  });
                } else {
                  helper
                    .cancelRefund(nextData)
                    .then((nextResult) => {
                      return resolve({
                        success: true,
                        message: MESSAGES.refund[result.ResponseCode],
                        ...nextResult,
                      });
                    })
                    .catch((error) => reject(error));
                }
              })
              .catch((error) => reject(error));
          }
        })
        .catch((error) => reject(error));
    });
  },
};
