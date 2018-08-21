module.exports = (function () {
  return {
    dbDev: {
      host: '127.0.0.1', //主机
      user: 'root', //MySQL认证用户名
      password: 'WANGdong123!', //MySQL认证用户密码，没有测试没有密码时为空是否能登陆，不能的话设置下登陆密码
      port: '3306',
      database: 'girlbase'
    },
    dbProd: {
      host: '127.0.0.1', //主机
      user: 'wandong', //MySQL认证用户名
      password: 'wangdong123!', //MySQL认证用户密码，没有测试没有密码时为空是否能登陆，不能的话设置下登陆密码
      port: '3306',
      database: 'girlbase'
    }
  }
})()