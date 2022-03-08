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
          resolve({ client, error: null });
        }
      );
    }),

  inquiry: (params) => {
    return new Promise((resolve, reject) => {
      client()
        .then((client) => {
          client.bpInquiryRequest(params, (error, data)=> {
            if (error) return reject(error);
            if (data.return == 0) return resolve({ success: true });
            resolve({ success: false, message: result.return });
          });
        })
        .catch((error) => reject(error));
    });
  },

  settle: (params) => {
    return new Promise((resolve, reject) => {
      helper
        .client()
        .then((client) => {
          client.bpSettleRequest(params, (error, data) => {
            if (error) return reject(error);
            resolve({
              success: data.return == 0,
              message: data.return != 0 ? data.return : undefined,
            });
          });
        })
        .catch((error) => reject(error));
    });
  },

  reverse: (params) => {
    return new Promise((resolve, reject) => {
      helper
        .client()
        .then((client) => {
          client.bpReversalRequest(params, (error, data) => {
            if (error) return reject(error);
            resolve({
              success: data.return == 0,
              message: data.return != 0 ? data.return : undefined,
            });
          });
        })
        .catch((error) => reject(error));
    });
  },
};
