/*
 * @Author: wang_donga@Ctrip.com
 * @Date: 2018-07-12 00:09:48
 * @Description: 获取专辑详细信息
 */

var express = require('express');
var router = express.Router();
var Album = require('../model/Album');
const { URL, URLSearchParams } = require('url');

router.get('/url', function (req, res, next) {
  let url  = '';
  if ((req.method).toLowerCase()=== 'get') {
    url = `${req.protocol}://${req.hostname}:80/albumInfo${req.url}`

    const myURL = new URL(url);
    let albumId = myURL.searchParams.get('albumId')

    var album = new Album();
    album.funcGetAlbumInfo(albumId).then((result) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result));
    })
  }
});

module.exports = router;
