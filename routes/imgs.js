/*
 * @Author: wang_donga@Ctrip.com
 * @Date: 2018-07-12 00:09:48
 * @Description: 图片接口
 */

var express = require('express');
var router = express.Router();
var Album = require('../model/Album');
const { URL, URLSearchParams } = require('url');

router.get('/url', function (req, res, next) {
  let url  = ''
  if ((req.method).toLowerCase()=== 'get') {
    url = `${req.protocol}://${req.hostname}:80/imgs${req.url}`

    const myURL = new URL(url);
    let pageNo = myURL.searchParams.get('pageNo')
    let pageSize = myURL.searchParams.get('pageSize')

    var album = new Album();
    album.funcSelectAlbum(pageNo, pageSize).then((result) => {
      let obj = {
        success: true,
        list: result
      }
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(obj));
    })
  }
});

module.exports = router;
