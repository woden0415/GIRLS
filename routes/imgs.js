/*
 * @Author: wang_donga@Ctrip.com
 * @Date: 2018-07-12 00:09:48
 * @Description: 图片接口
 */

var express = require('express');
var router = express.Router();
let { funcSelectImgs } = require("../old/database")
// console.log(funcSelectImgs )
// const querystring = require('querystring');
const { URL, URLSearchParams } = require('url');

router.get('/url', function (req, res, next) {
  let url  = ''
  if ((req.method).toLowerCase()=== 'get') {
    url = `${req.protocol}://${req.hostname}:80/imgs${req.url}`

    const myURL = new URL(url);
    let pageNo = myURL.searchParams.get('pageNo')
    let pageSize = myURL.searchParams.get('pageSize')

    funcSelectImgs(pageNo, pageSize).then((result)=>{
      let obj = {
        success: true,
        list: result[0],
        total: result[1]
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(obj) );
    });
  }
});

module.exports = router;
