/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-11 11:03:34
 * @Description: 爬虫
 */
var superagent = require('superagent')
var charset = require("superagent-charset");
var cheerio = require('cheerio')

charset(superagent);
var fs = require('fs')

const Throttle = require('superagent-throttle');
let throttle = new Throttle({
  active: true,     // set false to pause queue
  rate: 10,          // how many requests can be sent every `ratePer`
  ratePer: 1000,   // number of ms in which `rate` requests may be sent
  concurrent: 2     // how many requests can be sent concurrently
})


// 获取标签数据
class Label {
  constructor() {}

  getAllLabelsInfos() {
    let url = 'http://www.27270.com/tag/'
    let arrLabel = [];
    let time = 0;
    let arrList = this.getAllLabelsLink(url);
    arrList.then((result) => {
      console.log('result.length', result.length);
      // result.map((urlItem, index, arr) => {
      //   this.getLabelDetail(urlItem).then((aa)=>{
      //     (function(url, i, a){
      //       console.log(`请求链接: ${i}    ----     ${url}`);
      //       if (i === 0) {
      //         fs.appendFileSync(`${__dirname}/label.js`, `[${JSON.stringify(aa, null, 2)},\n`)
      //       } else if (i === arr.length - 1) {
      //         fs.appendFileSync(`${__dirname}/label.js`, `${JSON.stringify(aa, null, 2)}]`)
      //       } else {
      //         fs.appendFileSync(`${__dirname}/label.js`, `${JSON.stringify(aa, null, 2)},\n`)
      //       }
      //     })(urlItem, index, arr)
      //   }).catch((e)=>{console.log(e);})
      // })
      Promise.all(result.map((urlItem, index, arr) => {
        return this.getLabelDetail(urlItem)
      })).then((all) => {
        console.log('all.length', all.length);
        fs.appendFileSync(`${__dirname}/label.js`, JSON.stringify(all, null, 2))
      }).catch((e)=>{
        console.log(e);
      })
    })
  }

  /**
   * @description 获得标签也所有相关标签
   * @param {string} url
   * @returns {Array}
   */
  getAllLabelsLink(listUrl) {
    let arrGirls = [3, 5, 6, 11, 12, 20, 21];
    let promiseA = new Promise((resolve) => {
      let newArr = [];
      superagent
        .get(listUrl)
        .charset('gbk')
        .end(function (err, res) {
          if (err) {
            console.log('30-------' + err)
          } else {
            let $ = cheerio.load(res.text)
            $('.tags_list').map((index, item) => {
              if (arrGirls.indexOf(index) > -1) {
                $(item).children('a[title]').map((indexA, itemA) => {
                  newArr.push(`http://www.27270.com${$(itemA).attr('href')}`)
                })
              }
            })
            resolve(newArr)
          }
        })
    })
    return promiseA;
  }

  /**
   * @description 获取该标签的详情数据
   * @param {String} url 该标签的url
   */
  getLabelDetail(url) {
    return new Promise((resolve) => {
      superagent
        .get(url)
        .use(throttle.plugin())
        .set({
          'Cookie': 'Hm_lvt_63a864f136a45557b3e0cbce07b7e572=1532689632Hm_lpvt_63a864f136a45557b3e0cbce07b7e572=1534031600',
          'Referer': 'http://www.27270.com/tag/'
        })
        .charset('gbk')
        .end(function (err, res) {
          if (err) {
            console.log('err.status', err)
          } else {
            let $ = cheerio.load(res.text);
            let objLabelInfo = {
              labelName: $('.Tag_Title_Gs').text(),
              labelDesc: $('.TagTop_box_Gs').children('p').text(),
              labelOter: [$('.list_tag').children('a').text()],
              labelLink: url
            }
            resolve(objLabelInfo)
          }
        })
    })
  }
}

let label = new Label();
label.getAllLabelsInfos()
