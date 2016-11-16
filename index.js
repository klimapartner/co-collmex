"use strict";
const request    = require("koa-request")
const Iconv      = require('iconv').Iconv
const iconv      = new Iconv('UTF-8','ISO-8859-1')
const parse      = require("csv-parse")
const _satzarten = require("./modules/satzarten.json")

function satz2CSV(satz){
  var arr = []
  for(var prop in satz){
    arr.push(satz[prop])
  }
  return arr.join(";")+"\n"
}

function CSVWrapper(str,options){
  this.str     = str
  this.options = options
  this.parse   = function(callback){
    return parse(this.str,this.options,callback)
  }.bind(this)
}

module.exports = function(options){
  this.User            = options.User            || "noname"
  this.Password        = options.Password        || "password"
  this.CMXKundennummer = options.CMXKundennummer || "112233"
  this.Firma_Nr        = options.Firma_Nr        || 1
  this.Systemname      = options.Systemname      || "koa-collmex"
  this.Output          = options.Output          || "object"
  this.get             = function *(options, output = this.Output){
    var req=""
    if(!Array.isArray(options)) options = [options]
    options.forEach(function(row){
      var satz = JSON.parse(JSON.stringify(_satzarten[row.Satzart]))
      for(var prop in row){
        satz[prop] = row[prop]
      }
      if(satz.hasOwnProperty("Firma_Nr")) satz.Firma_Nr     = row.Firma_Nr   || this.Firma_Nr
      if(satz.hasOwnProperty("Systemname")) satz.Systemname = row.Systemname || this.Systemname
      req       += satz2CSV(satz)
    }.bind(this))
    var login     = `LOGIN;${this.User};${this.Password}\n`;
    var post_data = login+req;
    var options   = {
            url      : `https://www.collmex.de/cgi-bin/cgi.exe?${this.CMXKundennummer},0,data_exchange`,
            headers  : { 'Content-Type': 'text/csv' },
            body     : iconv.convert(post_data),
            encoding : 'binary'
        };
    var res      = yield request.post(options)
    if(output == "raw") return res.body
    var parser   = new CSVWrapper(res.body,{delimiter:";",relax_column_count:true})
    var result   = yield parser.parse
    //var c1=new Date()
    var number = new RegExp(/^-?[0-9]*\.?[0-9]+(?:,?[0-9]+)?$/)
    var datum  = new RegExp(/^[\d]+\.[\d]+\.[\d]+$/)
    var datum2  = new RegExp(/^2[\d]{7}$/)
    result.forEach(function(row){
      row.forEach(function(field,index){
        if(number.test(field)){
          row[index] = parseFloat(row[index].replace(/\./g, '').replace(",","."))
        }
        if(datum.test(field)){
          var da = field.split(".")
          row[index] = `${da[2]}-${da[1]}-${da[0]}`
        }
        if(datum2.test(field)){
          row[index] = `${field[0]}${field[1]}${field[2]}${field[3]}-${field[4]}${field[5]}-${field[6]}${field[7]}`
        }
      })
    })
    //console.log((new Date())-c1)
    if(output == "object") return this.parse(result)
    if(output == "array") return result
    return result
  }.bind(this)
  this.parse = function(a){
    a.forEach(function(row,index){
      var satz = JSON.parse(JSON.stringify(_satzarten[row[0]]))
      var keys = Object.keys(satz)
      row.forEach(function(field,index){
        satz[keys[index]]=field
      })
      a[index]=satz
    })
    return a
  }
}
