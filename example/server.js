const express = require('express');
const gateway = require('./gateway');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/payment', (req, res) => {
  gateway
    .request(req.boy.gateway, req.boy.amount)
    .then((result) => {
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
      } else {
        console.log('message: ', result.message);
      }
    })
    .catch((error) => console.log(error));
});

app.get('/checkout', (req, res) => {
  const gateName = req.query.gate;
  let param;
  if (gateName == gateway.Types.Mellat) {
    param = {
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
      orderId: req.body.OrderId,
      // cardHolderPan: req.body.CardHolderPan,
      // resCode: req.body.ResCode,
      // token: '0001B1E83962A3DD0EC2872824C071245436ABD08951DD03F5FE',
      // ResCode: '0',
      // OrderId: '20220212134400',    };
    };
  }
  gateway
    .verify(gateName, param)
    .then((result) => {
      if (result.success) {
        //save invoice
        res.status(200).json({message:'successfully verified'});
      } else {
        //result.ResCode,
        //result.message
      }
    })
    .catch((error) => console.log(error));
});

app.listen(3000);
