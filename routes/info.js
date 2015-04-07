var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');

//get informations

module.exports = {
    class : function (req, res) {
        var getData = (url.parse(req.url,true)).query;
        if (!req.headers['sid']){
          console.log('sid is empty');
          res.json({resut: 'ng',reason: 'empty sid'});
          return
        }
        client.headers['Cookie'] = 'sid='+req.headers['sid'];
        
        client.setBrowser('chrome'); 
        var fetch = client.fetch('https://dh.force.com/digitalCampus/CampusDeliveryList?displayType=20')
        .then(function (result) {
          result.$('td').each(function (idx) {
            var tdd = result.$(this).text();
            console.log(tdd);
            //Date check
            var date = new Date(tdd);
            if(tdd == (date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate())){
              //if date
              
            }else{
              
            }
          });
          var data = {
            result:'ok'
          }
          res.send(data);
          
        }).catch(function (err) {
          // どこかでエラーが発生
          console.log(err);
          var data={
            result: "ng",
            reason: "code:" + err['statusCode']
          }
          res.json(data);
        })
    },
};