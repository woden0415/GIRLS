/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-14 00:00:14
 * @Description: 插入数据
 */

var mysql = require('mysql');
let fs = require('fs')
let Label = require('../../model/Label');
let Album = require('../../model/Album');
let Img = require('../../model/Img')
let { funcSelectImgs } = require("../../old/database")
// console.log(Label)

let runEnv = process.env.NODE_ENV || 'development'; // 运行环境
let databaseConfig = {}
// console.log('runEnv', runEnv)
if (runEnv.toLowerCase() === 'development'){
  databaseConfig = {
    host: '127.0.0.1', //主机
    user: 'root', //MySQL认证用户名
    password: 'WANGdong123!', //MySQL认证用户密码，没有测试没有密码时为空是否能登陆，不能的话设置下登陆密码
    port: '3306',
    database: 'girlbase'
  }
} else {
  databaseConfig = {
    host: '127.0.0.1', //主机
    user: 'wandong', //MySQL认证用户名
    password: 'wangdong123!', //MySQL认证用户密码，没有测试没有密码时为空是否能登陆，不能的话设置下登陆密码
    port: '3306',
    database: 'girlbase'
  }
}

var connection = mysql.createConnection(databaseConfig);

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  // console.error('connected as id ' + connection.threadId);
});

// 插入标签
// insertLabel()
function insertLabel() {
  fs.readFile(`${__dirname}/label.js`, (err, data)=> {
    if (err) {
      console.log(err);
      return 0
    }
    console.log('successs')
    let lab = new Label()
    let sqlStr = lab.funcInsertSql(JSON.parse(data))
    connection.query(sqlStr, function (error, results, fields) {
      if (error) throw error;
      console.log('ssss')

      connection.end();
    })
  })
}

// insertRelationLabelAlbum()
function insertRelationLabelAlbum () {
  getFile('album1.js').then((result) => {
      let arrAlbum1 = [];
      result.map((item, index, arr)=>{
        if (item.coverUrl) {
          arrAlbum1.push(item)
        }
      })
      let sql = `insert into relation_album_label_tbl (albumId, labelId) values `;
      let albumLen = arrAlbum1.length;
      for (let i = 0; i < albumLen; i++) {
        if (i !== albumLen - 1) {
          sql = sql + `("${arrAlbum1[i].albumId}", "${arrAlbum1[i].labelId}"),`
        } else {
          sql = sql + `("${arrAlbum1[i].albumId}", "${arrAlbum1[i].labelId}");`
        }
      }
      // console.log(sql.length)
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('insert relation_album_label_tbl ok')
        connection.end();
      })
    })
}

// 插入专辑

// insertAlbum()
function insertAlbum() {
  console.log('begin')
  fs.readFile(`${__dirname}/album1.js`, (err, data)=> {
    if (err) {
      console.log(err);
      return 0
    }
    console.log('successs')
    let arrData = JSON.parse(data);
    let arrTmp = []
    arrData.map((item, index, arr)=>{
      if (item.coverUrl) {
        arrTmp.push(item)
      }
    })
    let album = new Album()
    let sqlStr = album.funcInsertSql(arrTmp)
    connection.query(sqlStr, function (error, results, fields) {
      if (error) throw error;
      console.log('insertAlbum ok')

      connection.end();
    })
  })
}

// insertRelationAlbumImg ()
function insertRelationAlbumImg () {
  getFile('imgs.js').then((result) => {
      let arrImgs = [];
      result.map((item, index, arr)=>{
        if (item.imgUrl) {
          arrImgs.push(item)
        }
      })
      let sql = `insert into relation_img_album_tbl (imgId, albumId) values `;
      let imgsLen = arrImgs.length;
      for (let i = 0; i < imgsLen; i++) {
        if (i !== imgsLen - 1) {
          sql = sql + `("${arrImgs[i].imgId}", "${arrImgs[i].albumId}"),`
        } else {
          sql = sql + `("${arrImgs[i].imgId}", "${arrImgs[i].albumId}");`
        }
      }
      // console.log(sql.length)
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log('insert relation_img_album_tbl ok')
        connection.end();
      })
    })
}

// insertImg()
function insertImg() {
  fs.readFile(`${__dirname}/imgs.js`, (err, data)=> {
    if (err) {
      console.log(err);
      return 0
    }
    console.log('successs')

    let arrTmp = []
    let arrData = JSON.parse(data);
    arrData.map((item, index, arr)=>{
      if (item.imgUrl) {
        arrTmp.push(item);
      }
    })
    let img = new Img()
    let sqlStr = img.funcInsertSql(arrTmp)
    connection.query(sqlStr, function (error, results, fields) {
      if (error) throw error;
      console.log('img insert ok;')

      connection.end();
    })
  })
}



// 获取文件内容
function getFile(filename) {
  let promise1 = new Promise((resolve) => {
    fs.readFile(`${__dirname}/${filename}`, (err, data)=> {
      if (err) {
        console.log(err);
        return 0
      }
      resolve(JSON.parse(data))
    })
  })
  return promise1
}