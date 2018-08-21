var mysql = require('mysql');
let runEnv = process.env.NODE_ENV || 'development'; // 运行环境

let {
  dbDev,
  dbProd
} = require('../config/db')
let databaseConfig = (runEnv.toLocaleLowerCase() === 'development') ? dbDev : dbProd;

let connection;
if (!connection) {
  connection = mysql.createConnection(databaseConfig);
}

class DB {
  constructor(){

  }

  /**
   * @description 新建网络连接
   */
  connect() {
    if (connection && connection.threadId) {
      this.disConnect();
    } else {
      connection.connect((err) => {
        if (err) {
          console.error(`error connecting: ${err.stack}`);
          return ;
        }
        console.log(`connected as id: ${connection.threadId}`);
      })
    }
  }

  /**
   * @description 执行sql语句，后期可能会改为promise
   * @param {String} sql 需要执行的sql语句
   * @param {Fcuntion} callback 执行的回调函数 (err, results, fields)=>{}
   */
  exectSql(sql, callback) {
    console.log('exectSql')
    connection.query(sql, callback)
  }

  /**
   * @description 断开连接
   */
  disConnect(){
    if (connection.threadId) {
      connection.end();
    }
  }
}

module.exports = DB;