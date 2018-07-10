var mysql = require('mysql');
var fs = require('fs')
var http = require('http');

var connection = mysql.createConnection({
  host: '127.0.0.1', //主机
  user: 'root', //MySQL认证用户名
  password: 'WANGdong123!', //MySQL认证用户密码，没有测试没有密码时为空是否能登陆，不能的话设置下登陆密码
  port: '3306',
  database: 'girlbase'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  // console.error('connected as id ' + connection.threadId);
});

// // 读取文件内容
// let str = fs.readFileSync('./images_details.txt', 'utf8')
// let arr = str.split('\n')

// let str1 = ''
// arr.map((url, index, arr) => {
//   if (index < arr.length - 1) {
//     str1 += `('${url}'),`
//   }
// })
// str1 = str1.slice(0, -1);
// let SQLInsert = `INSERT INTO girl_img_tbl (girl_img_url) value ${str1}`;


let pageNo = 1
let pageSize = 10

let SQLSelect = `select * from girl_img_tbl limit ${(pageNo-1) * (pageSize)}, ${pageSize};`
let SQLSelect2 = `select * from girl_img_tbl`;

connection.query(`${SQLSelect2}`, function (error, results, fields) {
  if (error) throw error;
  console.log(results.length);
});
connection.query(`${SQLSelect}`, function (error, results, fields) {
  if (error) throw error;
  let arr1 = []
  console.log(Array.isArray(results))
  results.map((item, index, arr)=>{
    arr1.push(item.girl_img_url)
    console.log(item.girl_img_url)
  })
  console.log(arr1);
});

connection.end();


