var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');
var utils = require('utils')

//get informations

module.exports = {
    class : function (req, res) {
        client.headers['cookie'] =  new Buffer(req.headers['api_cookie'], 'base64').toString();
        client.setBrowser('chrome'); 
        var fetch = client.fetch('https://dh.force.com/digitalCampus/CampusDeliveryList?displayType=00')
        .then(function (result) {
          var resd = [];
          var trd = {};
          var i = 0;
          result.$('td').each(function (idx) {
            var tdd = utils.decNumRefToString(result.$(this).text()).replace("\n", '').replace(/\s+/g, "");
            
            //Date check
            var date = new Date(tdd);
            if(! isNaN( date.getTime() )){
              //if date
              trd['id'] = url.parse(result.$(this).parent().attr('onclick'),true).query['id'];
              trd['date'] = date;
              i = 0;
            }else{
              switch(i){
                case 1:
                  trd['status'] = tdd;
                case 2:
                  trd['kind'] = tdd;
                case 3:
                  trd['important'] = tdd;
                case 4:
                  trd['class_name'] = tdd;
                case 5:
                  trd['title'] = tdd;
              }
            }
            if (i >= 5){
              i = 0;
              resd.push(trd);
              trd = {};
              i = 0;
            }
            i++;
          });
          res.send({data: resd});
        }).catch(function (err) {
          res.json(err['statusCode'], {code: 'dhw_server_error', status_code: err['statusCode']});
        })
    },
};