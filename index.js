const mellatGateway = require('./mellat');
const melliGateway = require('./melli');
const Types = Object.freeze({ Mellat: 'mellat', Melli: 'melli' });

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
};

module.exports = {
  // if (!conf) return null;
  // let config = conf;
  // return {
  Types,
  config,
  request: (gatewayType, amount, additionalData = '') => {
    if (gatewayType == Types.Mellat)
      return mellatGateway.request(amount, config.mellat, additionalData);
    if (gatewayType == Types.Melli)
      return melliGateway.request(amount, config.melli);
  },
  verify: (gatewayType, param) => {
    if (gatewayType == Types.Mellat) {
      return mellatGateway.verify(param, config.mellat);
    }
    if (gatewayType == Types.Melli) {
      return melliGateway.verify(param.token, config.melli);
    }
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
