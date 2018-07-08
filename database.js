var mysql = require('mysql');
var fs = require('fs')

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

  console.error('connected as id ' + connection.threadId);
});

// 读取文件内容
let str = fs.readFileSync('./images_details.txt', 'utf8')
let arr = str.split('\n')
console.log(arr.length)

let str1 = ''
arr.map((url, index, arr) => {
  if (index < arr.length - 1) {
    str1 += `('${url}'),`
  }
})
str1 = str1.slice(0, -1);
let SQL = `INSERT INTO girl_img_tbl (girl_img_url) value ${str1}`;

connection.query(`${SQL}`, function (error, results, fields) {
  if (error) throw error;
  console.log(results.insertId);
});

connection.end();
