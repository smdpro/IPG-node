const axios = require('axios');

module.exports = {
  requestPayment: (data) => {
    return axios({
      method: 'post',
      url: `https://sepehr.shaparak.ir:8081/V1/PeymentApi/GetToken?Amount=${data.amount}&CallbackUrl=${data.callbackURL}&InvoiceId=${data.invoiceID}&Payload=${data.payload}&TerminalId=${data.terminalID}`,
    });
  },

  verifyPayment: (data) => {
    return axios({
      method: 'post',
      url: `https://sepehr.shaparak.ir:8081/V1/PeymentApi/Advice?digitalreceipt=${data.digitalreceipt}&Tid=${data.terminalID}`,
      
    });
  },
  
};
