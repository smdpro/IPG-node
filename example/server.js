const express = require('express');
const gateway = require('./gateway');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/payment', (req, res) => {
  gateway
    .request(req.boy.gateway, 50000)
    .then((result) => {
      console.log('payment->result==', result);
      if (result.success) {
        if (req.boy.gateway == gateway.Types.Mellat) {
          res.status(200).json({
            redirectUrl: `https://bpm.shaparak.ir/pgwchannel/startpay.mellat`,
            refId: result.RefId,
          });
        }
        if (req.boy.gateway == gateway.Types.Melli) {
          res.status(200).json({
            redirectUrl: `https://sadad.shaparak.ir/VPG/Purchase`,
            token: result.Token,
          });
        }
        if (req.boy.gateway == gateway.Types.Saderat) {
          res.status(200).json({
            redirectUrl: `https://sepehr.shaparak.ir:8080/Pay`,
            method: 'post',
            TerminalID: gateway.config.saderat.credentail.terminalID,
            token: result.AccessToken,
          });
        }
      } else {
        /* melli
        //  success: false,
        //  message: 'اطلاعات SignData ارسالی اشتباه است',
        //  ResCode: '1025',
        //  Token: null,
        //  Description: 'اطلاعات SignData ارسالی اشتباه است'
        */
        /* mellat
        
        */
        res.status(400).json(result.message);
        console.log('message: ', result.message);
      }
    })
    .catch((error) => console.log(error));
});

app.get('/checkout', (req, res) => {
  console.log('checkout->body==', req.body);
  console.log('checkout->query==', req.query.gate);
  const gateName = req.query.gate;
  let param;
  if (gateName == gateway.Types.Mellat) {
    param = {
      orderId: req.body.orderId,
      saleOrderId: req.body.SaleOrderId,
      saleReferenceId: req.body.SaleReferenceId,
      // RefId: 'FC331DF6C53D4992',
      // ResCode: '0',
      // SaleOrderId: '20220112135601',
      // SaleReferenceId: '216058156624',
      // CardHolderInfo:
      //   'ECCD378AFF3C4BA2216500F9977E4DA3118E3B4EA5BAF261F509A82BD1CF7183',
      // CardHolderPan: '610444******7344',
      // FinalAmount: '50000',
    };
  }
  if (gateName == gateway.Types.Melli) {
    param = {
      token: req.body.token,
      // cardHolderPan: req.body.CardHolderPan,
      // resCode: req.body.ResCode,
      // token: '0001B1E83962A3DD0EC2872824C071245436ABD08951DD03F5FE',
      // ResCode: '0',
      // OrderId: '20220212134400',    };
    };
  }
  if (gateName == gateway.Types.Saderat) {
    param = {
      // respcode: req.body.respcode,
      // respmsg: req.body.respmsg,
      // amount: req.body.amount,
      // invoiceid: req.body.invoiceid,
      // reacenumber: req.body.reacenumber,
      // billid: req.body.billid,
      // payid: req.body.payid,
      token: req.body.digitalreceipt,
      
    };
  }
  gateway
    .verify(gateName, param)
    .then((result) => {
      console.log('checkout->result==', result);
      if (result.success) {
        res.status(200).json({ message: 'successfully verified' });
      } else {
        res.status(400).json(result);
        //result.ResCode,
        //result.message
      }
    })
    .catch((error) => console.log(error));
});

app.get('/refund', (req, res) => {
  const gateName = req.query.gate;
  let param;
  if (gateName == gateway.Types.Mellat) {
    param = {
      SaleOrderId: '20220112135601',
      SaleReferenceId: '216058156624',
    };
  }
  if (gateName == gateway.Types.Melli) {
    param = {
      token: '0001B0E73962A3DD1EC2178DA006CEB66D15B456EEF48C7739A7',
    };
  }
  gateway
    .refund(gateName, param)
    .then((result) => {
      console.log('refund->result==', result);
      if (result.success) {
        if (gateName == gateway.Types.Mellat) {
          // success: true,
          // message: "0,209758337816",
          // ResCode: "0",
          // TransactionCode: "209758337816"
        }
        if (gateName == gateway.Types.Melli) {
        }
        res.status(200).json({ message: 'successfully refunded' });
      } else {
        console.log('message: ', result.message);
        res.status(400).json(result.message);
        //result.ResCode,
        //result.message
      }
    })
    .catch((error) => console.log(error));
});

app.listen(3000);
