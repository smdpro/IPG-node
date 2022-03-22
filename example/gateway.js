const ipg = require('../index');
ipg.config = {
  mellat: {
    credentail: {
      terminalId: process.env.MELLAT_TERMINALID,
      userName: process.env.MELLAT_USERNAME,
      userPassword: process.env.MELLAT_USERPASSWORD,
    },
    callbackUrl: `http://your.domain.com/checkout?gate=${ipg.Types.Mellat}`,
    currencyIsToman: false,
  },
  melli: {
    credentail: {
      TerminalId: process.env.MELLI_TERMINALID,
      MerchantId: process.env.MELLI_MERCHANTID,
      TerminalKey: process.env.MELLI_TERMINALKEY,
    },
    callbackUrl: `http://your.domain.com/checkout?gate=${ipg.Types.Melli}`,
    currencyIsToman: false,
  },
  saderat: {
    credentail: {
      terminalID: process.env.MELLI_TERMINALID,
    },
    callbackUrl: `http://your.domain.com/checkout?gate=${ipg.Types.Saderat}`,
    currencyIsToman: false,
  },
};

module.exports=ipg;
