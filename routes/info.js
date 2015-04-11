var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');
var utils = require('utils')

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
          var data = {
            result:'ok',
            data: resd
          }
          res.send(data);
          
        }).catch(function (err) {
          // どこかでエラーが発生
          console.log(err);
          var data={
            result: "ng",
            //debugように code : という文字列を追加してる。エラーをどのように処理するか決めたら変える。
            reason: "code:" + err['statusCode']
          }
          res.json(data);
        })
    },
};