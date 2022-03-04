const soap = require('soap');
module.exports = {
  client: () =>
    new Promise((resolve, reject) => {
      soap.createClient(
        'https://bpm.shaparak.ir/pgwchannel/services/pgw?wsdl',
        {
          overrideRootElement: { namespace: 'ns1' },
          wsdl_headers: { namespace: 'http://interfaces.core.sw.bps.com/' },
        },
        function (error, client) {
          if (error) return reject({ client: null, error });
          else return resolve({ client, error: null });
        }
      );
    }),

  inquiry: (saleOrderId, saleRefId) => {
    return new Promise((resolve, reject) => {
      client()
        .then((client) => {
          var params = {
            terminalId: MELLAT.TERMINAL,
            userName: MELLAT.USERNAME,
            userPassword: MELLAT.PASSWORD,
            orderId: saleOrderId,
            saleOrderId: saleOrderId,
            saleReferenceId: saleRefId,
          };
          client.bpInquiryRequest(params, function (error, data) {
            if (error) return reject(error);
            if (data.return == 0) {
              resolve({ success: true });
            } else {
              return resolve({ success: false, message: result.return });
            }
          });
        })
        .catch((error) => reject(error));
    });
  },

  settle: (saleOrderId, saleRefId) => {
    return new Promise((resolve, reject) => {
      helper
        .client()
        .then((client) => {
          var params = {
            terminalId: MELLAT.TERMINAL,
            userName: MELLAT.USERNAME,
            userPassword: MELLAT.PASSWORD,
            orderId: saleOrderId,
            saleOrderId: saleOrderId,
            saleReferenceId: saleRefId,
          };
          client.bpSettleRequest(params, function (error, data) {
            if (error) return reject(error);
            if (data.return == 0) return resolve({ success: true });
            resolve({ success: false, message: data.return });
          });
        })
        .catch((error) => reject(error));
    });
  },

  reverse: (saleOrderId, saleRefId) => {
    return new Promise((resolve, reject) => {
      helper
        .client()
        .then((client) => {
          var params = {
            terminalId: MELLAT.TERMINAL,
            userName: MELLAT.USERNAME,
            userPassword: MELLAT.PASSWORD,
            orderId: saleOrderId,
            saleOrderId: saleOrderId,
            saleReferenceId: saleRefId,
          };
          client.bpReversalRequest(params, (error, data) => {
            if (error) return reject(error);
            if (data.return == 0) return resolve({ success: true });
            resolve({ success: true, message: data.return });
          });
        })
        .catch((error) => reject(error));
    });
  },
};
