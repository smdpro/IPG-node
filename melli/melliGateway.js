const helper = require('./helper');
const moment = require('moment');
const { RequestResCode, VerifyResCode } = require('.');

module.exports = {
  request: (amount, config) => {
    return new Promise((resolve, reject) => {
      let Amount = config.amountIsToman ? amount * 10 : amount;
      let orderId = Number(moment().format('YMMDDHHmmSS'));
      let signData = helper.encryptPkcs7(
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
        .getToken(data)
        .then((result) => {
          return resolve({
            success: true,
            message: RequestResCode[result.ResCode],
            ...result,
            // ResCode: result.ResCode,
            // RefId: result.Token,
            // redirectURL: `https://sadad.shaparak.ir/VPG/Purchase?Token=${result.Token}`,
          });
        })
        .catch((error) => {
          return reject({ err: true, error });
        });
    });
  },

  verify: (token, config) => {
    return new Promise((resolve, reject) => {
      let verifyData = {
        Token: token,
        SignData: helper.encryptPkcs7(token, config.credentail.TerminalKey),
      };
      helper
        .verifyPayment(verifyData)
        .then((result) => {
          if (result.ResCode.toString() === '0') {
            return resolve({
              success: true,
              ...result,
            });
          } else {
            return resolve({
              success: false,
              message: VerifyResCode[result.ResCode],
              ...result,
            });
          }
        })
        .catch((error => reject({ err: true, error })));
    });
  },

  refund: (param, config) => {
    return new Promise((resolve, reject) => {
      let Amount = config.amountIsToman ? param.amount * 10 : param.amount;
      let RefundAmount = config.amountIsToman
        ? param.refundAmount * 10
        : param.refundAmount;
      let signData = helper.encryptPkcs7(
        `${param.saleRetrivalRef};${Amount};${config.credentail.TerminalId};${param.saleReferenceId};${RefundAmount};${param.token}`,
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
          if (dt && dt.ResponseCode.toString() == '1010') {
            let nextSignData = helper.encryptPkcs7(
              `${dt.RefundId}`,
              config.credentail.TerminalKey
            );
            let nextData = { RefundId: dt.RefundId, SignData: nextSignData };
            helper
              .confirmRefund(nextData)
              .then((result) => {
                if (result && result.ResponseCode.toString() == '1010') {
                  return resolve({
                    success: true,
                    ...result,
                  });
                } else {
                  helper
                    .cancelRefund(nextData)
                    .then((nextResult) => {
                      return resolve({
                        success:true,
                        ...nextResult,
                      });
                    })
                    .catch((error) => {
                      return reject({ err: true, error });
                    });
                }
              })
              .catch((error) => {
                return reject({ err: true, error });
              });
          }
        })
        .catch((error) => {
          return reject({ err: true, error });
        });
    });
  },
};

