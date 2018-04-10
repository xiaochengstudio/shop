var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/vue_shop_lesson')
mongoose.connection.on("connected",function(){
  console.log('数据库连接成功')
})

/* 查询商品列表数据*/
router.get('/', function(req, res, next) {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = req.param("sort");
  let priceLevel = req.param("priceLevel");
  let skip = (page-1)*pageSize;
  let priceGt = '';
  let priceLte = '';
  let params = {};

  if(priceLevel!='all'){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte=100;break;
      case '1':priceGt = 100;priceLte=500;break;
      case '2':priceGt = 500;priceLte=1000;break;
      case '3':priceGt = 1000;priceLte=2000;break;
      case '4':priceGt = 2000;priceLte=3000;break;
      case '5':priceGt = 3000;priceLte=6000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err, doc) {
    if(err){
      res.json({
        status: '1',
        msg: err.message
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count: doc.length,
          list: doc
        }
      })
    }
  })
});


module.exports = router;
