var assert = require('chai').assert
var Collmex = require("../index.js")
try{
  var options = require("./options.json")
}catch(err){
  var options = require("./options.default.json")
}
var collmex = new Collmex(options)
var collmexERR = new Collmex({
  "User"            : "sdfsadfg",
  "Password"        : "sdgsdg",
  "CMXKundennummer" : 118280,
  "Firma_Nr"        : 1,
  "Systemname"      : "koa-collmex-test"
})
var co = require("co")


function onerr(err){
  console.log(err)
}


describe('koa-collmex', function() {
  it('should be a function', function () {
      assert.equal(typeof Collmex,"function")
  });
  it('should be a constructor', function () {
      assert.equal(typeof collmex,"object")
  });
  it('should be able to get product data from collmex', function (done) {
      co(
        function* (){
          var res = yield collmex.get([{Satzart:"PRODUCT_GET",Produktnummer:options.Produktnummer}],"array")
          assert.equal(Array.isArray(res),true)
          assert.equal(res.length,3)
          assert.equal(Array.isArray(res[0]),true)
          assert.equal(res[0][0],"CMXPRD")
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get data in raw format', function (done) {
      co(
        function* (){
          var res = yield collmex.get([{Satzart:"PRODUCT_GET",Produktnummer:options.Produktnummer}],"raw")
          assert.equal(Array.isArray(res),false)
          assert.equal(typeof res,"string")
          assert.equal(res.substring(0,6),"CMXPRD")
          done()
        }
      ).catch(onerr);
  });
  it('should be able to parse data to objects', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"PRODUCT_GET",Produktnummer:options.Produktnummer})
          assert.equal(Array.isArray(res),true)
          assert.equal(typeof res[0],"object")
          assert.equal(res[0].Satzart,"CMXPRD")
          assert.equal(res[0].hasOwnProperty("undefined"),false)

          done()
        }
      ).catch(onerr);
  });
  it('should return a success MESSAGE(S) for successfull requests', function (done) {
      co(
        function* (){
          var res = yield collmex.get([{Satzart:"PRODUCT_GET",Produktnummer:options.Produktnummer}])
          assert.equal(res[1].Satzart,"MESSAGE")
          assert.equal(res[2].Satzart,"MESSAGE")
          assert.equal(res[1].Meldungstyp,"S")
          assert.equal(res[2].Meldungstyp,"S")
          done()
        }
      ).catch(onerr);
  });
  it('should return an error MESSAGE(E) if there was an error in the request', function (done) {
      co(
        function* (){
          var res = yield collmexERR.get([{Satzart:"PRODUCT_GET",Produktnummer:options.Produktnummer}])
          assert.equal(res[0].Satzart,"MESSAGE")
          assert.equal(res[0].Meldungstyp,"E")
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get product groups', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"PRODUCT_GROUPS_GET"})
          assert.equal(res[0].Satzart,"PRDGRP")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get available stocks', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"STOCK_AVAILABLE_GET",Produktnummer:options.Produktnummer})
          assert.equal(res[0].Satzart,"STOCK_AVAILABLE")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get stocks', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"STOCK_GET",Produktnummer:options.Produktnummer})
          assert.equal(res[0].Satzart,"CMXSTK")
          assert.equal(res[0].hasOwnProperty("undefined"),false)

          done()
        }
      ).catch(onerr);
  });
  it('should be able to get stock changes', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"STOCK_CHANGE_GET",Produktnummer:options.Produktnummer})
          assert.equal(res[0].Satzart,"STOCK_CHANGE")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get sales orders', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"SALES_ORDER_GET",Auftragsnummer:options.Auftragsnummer})
          assert.equal(res[0].Satzart,"CMXORD-2")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get invoices', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"INVOICE_GET",Rechnungsnummer:options.Rechnungsnummer})
          assert.equal(res[0].Satzart,"CMXINV")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get delivery notices', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"DELIVERY_GET",Lieferungsnummer:options.Lieferungsnummer})
          assert.equal(res[0].Satzart,"CMXDLV")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get purchase orders', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"PURCHASE_ORDER_GET",Lieferantenauftragsnummer:options.Lieferantenauftragsnummer})
          assert.equal(res[0].Satzart,"CMXPOD")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get customers', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"CUSTOMER_GET",Kunde_Nr:options.Kunde_Nr})
          assert.equal(res[0].Satzart,"CMXKND")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get vendors', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"VENDOR_GET",Lieferanten_Nr:options.Lieferanten_Nr})
          assert.equal(res[0].Satzart,"CMXLIF")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get vendor agreements', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"VENDOR_AGREEMENT_GET",Lieferant_Nr:options.Lieferanten_Nr})
          assert.equal(res[0].Satzart,"CMXVAG")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get address groups', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"ADDRESS_GROUPS_GET"})
          assert.equal(res[0].Satzart,"ADRGRP")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get production orders', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"PRODUCTION_ORDER_GET"})
          assert.equal(res[0].Satzart,"PRODUCTION_ORDER")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get price groups', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"PRICE_GROUPS_GET"})
          assert.equal(res[0].Satzart,"PRICE_GROUP")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get vouchers', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"VOUCHER_GET"})
          assert.equal(res[0].Satzart,"VOUCHER")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get OPs for customers', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"OPEN_ITEMS_GET",Kunde_Nr:options.Kunde_Nr})
          assert.equal(res[0].Satzart,"OPEN_ITEM")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get OPs for vendors', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"OPEN_ITEMS_GET",Offene_Posten:1,Lieferant_Nr:options.Lieferanten_Nr})
          assert.equal(res[0].Satzart,"OPEN_ITEM")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get quotations', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"QUOTATION_GET",Angebotsnummer:options.Angebotsnummer})
          assert.equal(res[0].Satzart,"CMXQTN")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get addresses', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"ADDRESS_GET",Text:"Kühn"})
          assert.equal(res[0].Satzart,"CMXADR")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
  it('should be able to get bill of materials', function (done) {
      co(
        function* (){
          var res = yield collmex.get({Satzart:"BILL_OF_MATERIAL_GET"})
          assert.equal(res[0].Satzart,"CMXBOM")
          assert.equal(res[0].hasOwnProperty("undefined"),false)
          done()
        }
      ).catch(onerr);
  });
});
