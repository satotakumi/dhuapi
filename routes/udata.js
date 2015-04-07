var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');

module.exports = {
    attendance : function (req, res) {
        var url_parts = url.parse(req.url,true);
        var getData = url_parts.query;
        if (!req.headers['sid']){
          res.json({resut: 'ng',reason: 'empty sid'});
          return
        }
        client.headers['Cookie'] = 'sid='+req.headers['sid'];
        
        client.setBrowser('chrome'); 
        client.fetch('https://dh.force.com/digitalCampus/CampusHomePage')
        .then(function (result) {
          var data = {
            result:'ok',
            data: Number((result.$('.attendanceRateNumber').text()).replace("%", ""))
          }
          res.json(data);
        })
    },
};