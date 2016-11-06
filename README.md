# co-collmex
a collmex api wrapper for co and koa

## installation

    npm install co-collmex

## usage

### initialisation

    var Collmex = require("co-collmex")
    var collmex = new Collmex({
      User : "username",
      Password : "password",
      "CMXKundennummer" : 123456,
      "Firma_Nr" : 1,
      "Systemname" : "koa-collmex-test"
    })

### getting data

    var res = yield collmex.get({Satzart:"PRODUCT_GET",Produktnummer:12345})

`collmex.get` expects one or two parameters.

    collmex.get(data,output_format)

#### data

the first parameter can either be an object or an array of objects.
See the Collmex API Documentation for information on which parameters can be used for each  "Satzart".

so instead of getting a product an the available stock with two requests

    var res = yield collmex.get({Satzart:"PRODUCT_GET",Produktnummer:12345})
    var res = yield collmex.get({Satzart:"STOCK_AVAILABLE_GET",Produktnummer:12345})

you can get both in one go:

    var res = yield collmex.get([
      {Satzart:"PRODUCT_GET",Produktnummer:12345},
      {Satzart:"STOCK_AVAILABLE_GET",Produktnummer:12345}
    ])

this is important for example when sending orders to collmex.

#### output_format

the second parameter is optional and can be ommited. possible values for the output_format are:

| value | description |
| --- | --- |
| "object" | **default** turns the response into an array of objects with named properties according to the collmex api documentation. numeric values are converted to js notation (dezimal point). Dates are turned to js/mysql compatible dates.|
| "array" | turns the response into an array of arrays. useful for bulk inserts into mysql for example. numeric values are converted to js notation (dezimal point). Dates are turned to js/mysql compatible dates.|
| "raw" | the raw response (CSV with ";" as the seperator). no conversion is performed. |

all outputs are automatically converted to utf-8


posting data can be performed via the get method as well. i will at some point add a post method as an alias for sematic reasons.
