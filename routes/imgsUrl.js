/*
 * @Author: wang_donga@Ctrip.com
 * @Date: 2018-07-12 00:09:48
 * @Description: 图片接口
 */

var express = require('express');
var http = require('http')
var fs = require('fs')
var request = require('request')


var router = express.Router();

let {
  funcSelectImgs
} = require("../old/database")
// console.log(funcSelectImgs )
// const querystring = require('querystring');
const {
  URL,
  URLSearchParams
} = require('url');

router.get('/url', function (req, res, next) {
  let url = ''
  let str = req.url;
  str = str.slice(9)
  const myURL = new URL(str);

  var options = {
    url: str,
    headers: {
      'Referer': 'http://m.27270.com/'
    }
  };
  request(options)
    .on('error', function (err) {
      console.log(err)
    })
    .pipe(res);
});

module.exports = router;
