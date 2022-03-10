const axios = require('axios');
const CryptoJS = require('crypto-js');

const signingData = (str, key) => {
  let cipher = crypto.createCipheriv(
    'des-ede3',
    Buffer.from(key, 'base64'),
    ''
  );

  let encryptedData = Buffer.concat([
    cipher.update(str, 'utf8'),
    cipher.final(),
  ]);
  return encryptedData.toString('base64');
};
// const signingData = (str, key) => {
//   let keyHex = CryptoJS.enc.Base64.parse(key);
//   return CryptoJS.TripleDES.encrypt(str, keyHex, {
//     iv: keyHex,
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
//   }).toString();
// };

const hmacSHA256 = (data, key) =>
  CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(data, CryptoJS.enc.Base64.parse(key))
  );

module.exports = {
  signingData,
  requestPayment: (data) => {
    return axios({
      method: 'post',
      url: 'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
      headers: {
        'Content-Length': JSON.stringify(data).length,
        'Content-Type': 'application/json',
      },
      data,
    });
  },

  verifyPayment: (data) => {
    return axios({
      method: 'post',
      url: 'https://sadad.shaparak.ir/api/v0/Advice/Verify',
      headers: {
        'Content-Length': JSON.stringify(data).length,
        'Content-Type': 'application/json',
      },
      data,
    });
  },
  registerRefund: (data, key) => {
    let dataToSign = `${data.RetrievalRefNo};${data.Amount};${data.TerminalId};${data.SystemTraceNo};${data.RefundAmount};${data.Token}`;
    return axios({
      method: 'post',
      url: 'https://refund.sadadpsp.ir/api/v1/refund/Register',
      headers: {
        'Content-Type': 'application/json',
        'Sign-Data': `${hmacSHA256(dataToSign, key)}`,
        // Sign: `${signWithPrivateKey(dataToSign)}`,
      },
      data,
    });
  },
  confirmRefund: (data, key) => {
    let signData = `${data.RefundId}`;
    return axios({
      method: 'post',
      url: 'https://refund.sadadpsp.ir/api/v1/refund/Confirm',
      headers: {
        'Content-Length': JSON.stringify(data).length,
        'Content-Type': 'application/json',
        'Sign-Data': hmacSHA256(signData, key),
        //Sign: signWithPrivateKey(signData),
      },
      data,
    });
  },
  cancelRefund: (data, key) => {
    let signData = `${data.RefundId}`;
    return axios({
      method: 'post',
      url: 'https://refund.sadadpsp.ir/api/v1/refund/Cancel',
      headers: {
        'Content-Length': JSON.stringify(data).length,
        'Content-Type': 'application/json',
        'Sign-Data': hmacSHA256(signData, key),
        //Sign: signWithPrivateKey(signData),
      },
      data,
    });
  },
};
