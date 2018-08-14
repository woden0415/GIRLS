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
console.log('runEnv', runEnv)
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

// 插入专辑

function insertAlbum() {
  fs.readFile(`${__dirname}/album1.js`, (err, data)=> {
    if (err) {
      console.log(err);
      return 0
    }
    console.log('successs')
    let album = new Album()
    let sqlStr = album.funcInsertSql(JSON.parse(data))
    connection.query(sqlStr, function (error, results, fields) {
      if (error) throw error;
      console.log('ssss')

      connection.end();
    })
  })
}

// insertAlbum()


function insertImg() {
  fs.readFile(`${__dirname}/aa.js`, (err, data)=> {
    if (err) {
      console.log(err);
      return 0
    }
    console.log('successs')
    let img = new Img()
    let sqlStr = img.funcInsertSql(JSON.parse(data))
    connection.query(sqlStr, function (error, results, fields) {
      if (error) throw error;
      console.log('ssss')

      connection.end();
    })
  })
}

insertImg()
