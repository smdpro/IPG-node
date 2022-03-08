# IPG-node

Iranian payment gateway

[![npm version](https://badge.fury.io/js/mellat-checkout.svg)](https://badge.fury.io/js/mellat-checkout)

Unofficially implementing Iranian payment gateways in Node.JS

## Installation

Install the package from `npm`.

### NPM

```bash
npm install ipg-node
```

## Usage:

### Import and set configuration

```javascript
const ipg = require('ipg-node');

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
};
```

## API

### Payment Request:

#### Mellat:

```javascript
ipg
  .request(ipg.Types.Mellat, amount)
  .then((result) => {
    if (result.success) {
      //result.RefId,
    } else {
      //result.ResCode,
      //result.message
    }
  })
  .catch((error) => console.log(error));
```

#### Melli:

```javascript
ipg
  .request(ipg.Types.Melli, amount)
  .then((result) => {
    if (result.success) {
      // result.ResCode,
      // result.message,
      // result.Token,
      // ....
      // save invoice
    } else {
      // result.ResCode,
      // result.message
    }
  })
  .catch((error) => console.log(error));
```

### Verifing Payment:

#### Mellat

```javascript
ipg
  .verify(ipg.Types.Mellat, {
    orderId: req.body.SaleOrderId,
    saleOrderId: req.body.SaleOrderId,
    saleReferenceId: req.body.SaleReferenceId,
  })
  .then((result) => {
    if (result.success) {
      // ....
      // save invoice
    } else {
      // result.ResCode,
      // result.message
    }
  })
  .catch((error) => console.log(error));
```

#### Melli

```javascript
ipg
  .verify(ipg.Types.Melli, { token })
  .then((result) => {
    if (result.success) {
      //   result.ResCode,
      //   result.message,
      //   result.OrderId,
      //   result.RetrivalRefNo,
      //   result.SystemTraceNo,
      // ....
      //save invoice
    } else {
      //result.ResCode,
      //result.message
    }
  })
  .catch((error) => console.log(error));
```

### Refund Payment:

#### Mellat

```javascript
ipg
  .refund(ipg.Types.Mellat, {
    orderId,
    saleOrderId,
    saleReferenceId,
    refundAmount,
  })
  .then((result) => {
    if (result.success) {
      // result.TransactionCode,
      // ....
      // save invoice
    } else {
      // result.message,
      // result.ResCode,
    }
  })
  .catch((error) => console.log(error));
```

#### Melli

```javascript
ipg
  .refund(ipg.Types.Melli, {
    retrivalRef,
    systemTraceNo,
    refundAmount,
    amount,
    token,
  })
  .then((result) => {
    if (result.success) {
      //save invoice
    } else {
      //result.ResCode,
      //result.message
    }
  })
  .catch((error) => console.log(error));
```

### Implemented Gateways 

- [x] Mellat
- [x] Melli
- [ ] Pasargad
- [ ] Saderat

## Contributing

Contributions are welcome. Please submit PRs or just file an Issue if you see something broken or in need of improving.
