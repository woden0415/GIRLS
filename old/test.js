/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-11 11:03:34
 * @Description: 爬虫
 */
var superagent = require('superagent')
// var charset = require("superagent-charset");
var cheerio = require('cheerio')
// var userAgents = require('./util/userAgent')

// charset(superagent);
var fs = require('fs')

// const Throttle = require('superagent-throttle');
// let throttle = new Throttle({
//   active: true,     // set false to pause queue
//   rate: 20,          // how many requests can be sent every `ratePer`
//   ratePer: 1000,   // number of ms in which `rate` requests may be sent
//   concurrent: 2     // how many requests can be sent concurrently
// })


  /**
   * @description 获得标签也所有相关标签
   * @param {string} url
   * @returns {Array}
   */
  function fetchIP(listUrl) {
    let arrGirls = [5]
      superagent
        .get(listUrl)
        .set({
          'Cookie': 'Hm_lvt_63a864f136a45557b3e0cbce07b7e572=1532689632Hm_lpvt_63a864f136a45557b3e0cbce07b7e572=1534031600',
          'Referer': 'http://www.27270.com/'
        })
        .set({ 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)' })
        .end(function (err, res) {
          if (err) {
            console.log('30-------' + err)
          } else {
            let $ = cheerio.load(res.text)
            // $('.tags_list').map((index, item) => {
            //   if (arrGirls.indexOf(index) > -1) {
            //     $(item).children('a[title]').map((indexA, itemA) => {
            //       newArr.push(`http://www.27270.com${$(itemA).attr('href')}`)
            //     })
            //   }
            // })
            // resolve(newArr)
            var str = ''
            $('#ip_list').find('tr').map((index, item) => {
              if (index > 0) {
                str += $(item).children('td').eq(1).text()+':'+$(item).children('td').eq(2).text()+'\n'
              }
            })
            console.log(str)
          }
        })
  }

  fetchIP('http://www.xicidaili.com/wt/')



