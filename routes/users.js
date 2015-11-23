var express = require('express');
var router = express.Router();
var url = require('url');
var client = require('cheerio-httpcli');

// output response body
module.exports = {
    login : function (req, res) {
        var url_parts = url.parse(req.url,true);
        var getData = url_parts.query;
        client.setBrowser('chrome');
        client.fetch('https://dh.force.com/digitalCampus/campuslogin')
        .then(function (result) {
          var data = {};
          if (!getData['id']){
            data = {'result':'ng','reason':'id is empty'}
            res.send(data);
            return;
          }else if (!getData['pass']){
            data = {'result':'ng','reason':'password is empty'}
            res.send(data);
            return;
          }
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
          var data = {}
          if ((result.$('.messageText').text()).indexOf("&#12456;&#12521;&#12540;:&#12525;&#12464;&#12452;&#12531;&#12395;&#22833;&#25943;&#12375;&#12414;&#12375;&#12383;&#12290;&#12518;&#12540;&#12470;&#21517;&#12392;&#12497;&#12473;&#12527;&#12540;&#12489;&#12364;&#27491;&#12375;&#12356;&#12363;&#12372;&#30906;&#35469;&#12367;&#12384;&#12373;&#12356;&#12290;")  != -1){
            res.send(401,{code:'invalid_account'})
          }else{
            var redirect_url = decodeURI(result['body'].toString().substring(result['body'].search("window.location.href ='")+23,result['body'].search("';")));
            var sid = decodeURI(result['body'].toString().substring(result['body'].search("sid=")+4,result['body'].search("untethered=")-1));
            client.headers['Cookie'] = 'sid=' + sid + ';BrowserId=' + result.response.cookies['BrowserId'];
            client.setBrowser('chrome'); 
            client.fetch(redirect_url)
            .then(function (result) {
              var cookie = '';
              for(var key in result.response.cookies){
                  cookie += (key + '=' + result.response.cookies[key] + ';');
              }
              res.send({api_cookie: new Buffer(cookie).toString('base64')})
              //console.log(JSON.stringify(result['response']));
            }).catch(function(err){
              res.send(500, {code: 'dhw_server_error',status: err['statusCode']})
            })
          }
        });
        
    },
    
    attendance : function (req, res) {
        client.setBrowser('chrome');
        client.headers['cookie'] =  new Buffer(req.headers['api_cookie'], 'base64').toString();
        client.fetch('https://dh.force.com/digitalCampus/CampusHomePage')
        .then(function (result) {
          var attendance_parsent = (result.$('.attendanceRateNumber').text()).replace("%", "")
          res.send({attendance: attendance_parsent});
        }).catch(function(err){
          //TODO: ステータスコードを500にするか、401にするか。
          res.send(err['statusCode'], {code: 'dhw_server_error'});
        })
    },

};

