var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');

//get informations

module.exports = {
    class : function (req, res) {
        var getData = (url.parse(req.url,true)).query;
        if (!req.headers['sid']){
          res.json({resut: 'ng',reason: 'empty sid'});;
          return
        }
        client.headers['Cookie'] = 'sid='+req.headers['sid'];
        
        client.setBrowser('chrome'); 
        client.fetch('https://dh.force.com/digitalCampus/CampusDeliveryList?displayType=20')
        .then(function (result) {
        res.send(result['body']);
        return;
        var rows = result.$("table")[0].rows;
          $.each(rows, function(i) {
            var cells = rows[i].cells;
            // 行を１つずつ取り出す
            $.each(cells, function() {
                var td = $(this);
                $.each(td,function() {
                  console.log($(this).text());
                });
          });
         });
          
          var data = {
            result:'ok',
          }
          res.json(data);
        })
    },
};