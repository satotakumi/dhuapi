var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');
var jsforce = require('jsforce');

  // output response body
module.exports = {
    login : function (req, res) {
        var url_parts = url.parse(req.url,true);
        var getData = url_parts.query;
        
        client.setBrowser('chrome');

        client.fetch('https://dh.force.com/digitalCampus/campuslogin')
        .then(function (result) {
          var ViewState = result.$('input[name="com.salesforce.visualforce.ViewState"]').val();
          var ViewStateVersion = result.$('input[name="com.salesforce.visualforce.ViewStateVersion"]').val();
          var ViewStateMAC = result.$('input[name="com.salesforce.visualforce.ViewStateMAC"]').val();
          return result.$('form').eq(0).submit({
            'loginPage:formId:j_id33': getData['id'],
            'loginPage:formId:j_id34': getData['pass'],
            'com.salesforce.visualforce.ViewState' : ViewState,
            'com.salesforce.visualforce.ViewStateVersion' : ViewStateVersion,
            'com.salesforce.visualforce.ViewStateMAC' : ViewStateMAC
          });
        })
        .then(function (result) {
          var sid = decodeURI(result['body'].toString().substring(result['body'].search("sid=")+4,result['body'].search("untethered=")-1));
          console.log(sid);
          var data = {'result':'ok','sid':sid}
          res.send(data);
        });
        
    },
    
    attendance : function (req, res) {
        var url_parts = url.parse(req.url,true);
        var getData = url_parts.query;
        if (!getData['sid']){
          res.send({'resut':'ng','reason':'empty sid'});
          return
        }
        client.headers['Cookie'] = 'sid='+getData['sid'];
        client.setBrowser('chrome'); 
        client.fetch('https://dh.force.com/digitalCampus/CampusHomePage')
        .then(function (result) {
          res.send((result.$('.attendanceRateNumber').text()).replace("%", ""));
        })
    },

};

