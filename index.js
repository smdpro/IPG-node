const moment = require('moment');
const { MellatGateway, MellatResCode } = require('./mellat');
const { MelliGateway, MelliResCode, MelliVerifyResCode } = require('./melli');
const Types = Object.freeze({ Mellat: 'mellat', Melli: 'melli' });

let config = {
  mellat: {
    credentail: {
      terminalId: MELLAT.TERMINAL,
      userName: MELLAT.USERNAME,
      userPassword: MELLAT.PASSWORD,
    },
    callbackUrl: '',
    amountIsToman: false,
  },
  melli: {
    credentail: {
      TerminalId: '',
      MerchantId: '',
      TerminalKey: '',
    },
    callbackUrl: '',
    amountIsToman: false,
  },
};

module.exports = (conf) => {
  if (!conf) return null;
  let config = conf;
  return {
    Types,
    config,
    request: (gatewayType, amount, additionalData = '') => {
      if (gatewayType == Types.Mellat)
        return MellatGateway.request(amount, config.mellat);
      if (gatewayType == Types.Melli)
        return MelliGateway.request(amount,config.melli);
    },
    verify: (gatewayType, param) => {
      if (gatewayType == Types.Mellat) {
        return MellatGateway.verify(param, config.mellat);
      }
      if (gatewayType == Types.Melli) {
        return MelliGateway.verify(param.token, config.melli);
      }
    },
    refund: (gatewayType, param) => {
      if (gatewayType == Types.Mellat) {
        return MellatGateway.refund(param, config.mellat);
      }
      if (gatewayType == Types.Melli) {
        return MelliGateway.refund(param, config.melli);
      }
    },
  };
};
