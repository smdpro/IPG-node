const mellatGateway = require('./mellat');
const melliGateway = require('./melli');
const saderatGateway = require('./saderat');
const Types = Object.freeze({
  Mellat: 'mellat',
  Melli: 'melli',
  Saderat: 'saderat',
});

let config = {
  mellat: {
    credentail: {
      terminalId: '',
      userName: '',
      userPassword: '',
    },
    callbackUrl: '',
    currencyIsToman: false,
  },
  melli: {
    credentail: {
      TerminalId: '',
      MerchantId: '',
      TerminalKey: '',
    },
    callbackUrl: '',
    currencyIsToman: false,
  },
  saderat: {
    credentail: {
      terminalID: '',
    },
    callbackUrl: '',
    currencyIsToman: false,
  },
};

module.exports = {
  Types,
  config,
  request: (gatewayType, amount, additionalData = '') => {
    if (gatewayType == Types.Mellat)
      return mellatGateway.request(amount, config.mellat, additionalData);
    if (gatewayType == Types.Melli)
      return melliGateway.request(amount, config.melli);
    if (gatewayType == Types.Saderat)
      return saderatGateway.request(amount, config.saderat);
  },
  verify: (gatewayType, param) => {
    if (gatewayType == Types.Mellat)
      return mellatGateway.verify(param, config.mellat);
    if (gatewayType == Types.Melli)
      return melliGateway.verify(param.token, config.melli);
    if (gatewayType == Types.Saderat)
      return saderatGateway.verify(param.digitalreceipt, config.saderat);
  },
  refund: (gatewayType, param) => {
    if (gatewayType == Types.Mellat) {
      return mellatGateway.refund(param, config.mellat);
    }
    if (gatewayType == Types.Melli) {
      return melliGateway.refund(param, config.melli);
    }
  },
  // };
};
