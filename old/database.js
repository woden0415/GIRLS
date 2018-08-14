var mysql = require('mysql');
// var fs = require('fs')
// var http = require('http');
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


/**
 * @description 分页查询
 * @param {number} pageNo 一页多少条
 * @param {number} pageSize 多少页
 */
function funcSelectImgs(pageNo, pageSize) {

  let promise1 = new Promise((resolve) => {
    let SQLSelect = `select * from girl_img_tbl limit ${(pageNo - 1) * (pageSize)}, ${pageSize};`
    connection.query(`${SQLSelect}`, function (error, results, fields) {
      if (error) throw error;
      let arr1 = []
      results.map((item, index, arr) => {
        arr1.push(item.girl_img_url)
      })
      resolve(arr1)
    })
  });

  let promise2 = new Promise((resolve) => {
    let SQLSelect = `select * from girl_img_tbl;`
    connection.query(`${SQLSelect}`, function (error, results, fields) {
      if (error) throw error;
      resolve(results.length);
    });
  })

  return Promise.all([promise1, promise2]);
}

// connection.end();

module.exports = {
  funcSelectImgs
}
