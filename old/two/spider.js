/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-11 11:03:34
 * @Description: 爬虫
 */
var superagent = require('superagent')
var charset = require("superagent-charset");
var cheerio = require('cheerio')
var userAgents = require('./util/userAgent')
// var proxyAgents = require('./util/proxyAgent')

require('superagent-proxy')(superagent)
charset(superagent);
var fs = require('fs')
// var proxy = proxyAgents[parseInt(Math.random() * proxyAgents.length)];
var proxy = 'http://transfer.moguproxy.com:9001';
var appKey = 'bDhHajFKa21xMUtSd0l5TjpIdVgwdmlzSEp4cGVBOTJX';
const Throttle = require('superagent-throttle');
let throttle = new Throttle({
  active: true,     // set false to pause queue
  rate: 5,          // how many requests can be sent every `ratePer`
  ratePer: 1000,   // number of ms in which `rate` requests may be sent
  concurrent: 2     // how many requests can be sent concurrently
})


// 获取标签数据
class Label {
  constructor() {}

  getAllLabelsInfos() {
    let url = 'http://www.27270.com/tag/'
    let arrList = this.getAllLabelsLink(url);
    arrList.then((result) => {
      console.log('result.length', result.length);
      result.map((urlItem, index, arr) => {
        this.getLabelDetail(urlItem).then((aa)=>{
          (function(url, i, a){
            fs.appendFile(`${__dirname}/label.js`, `${JSON.stringify(aa, null, 2)},`, function(err) {
              if (err) {
                throw err
              }
            })
          })(urlItem, index, arr)
        }).catch((e)=>{console.log(e);})
      })
      // Promise.all(result.map((urlItem, index, arr) => {
      //   return this.getLabelDetail(urlItem)
      // })).then((all) => {
      //   console.log('all.length', all.length);
      //   fs.appendFileSync(`${__dirname}/label.js`, JSON.stringify(all, null, 2))
      // })
    })
  }

  /**
   * @description 获得标签也所有相关标签
   * @param {string} url
   * @returns {Array}
   */
  getAllLabelsLink(listUrl) {
    // let arrGirls = [3, 5, 6, 11, 12, 20, 21];
    let arrGirls = [5]
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
            let labelPages = $('.TagPage').find('a').length !== 0 ? $('.TagPage').find('a').last().attr('href').split('')[$('.TagPage').find('a').last().attr('href').indexOf('.html') - 1] : 1
            let objLabelInfo = {
              labelId: generatorRandomString(20),
              labelName: $('.Tag_Title_Gs').text(),
              labelDesc: $('.TagTop_box_Gs').children('p').text(),
              labelOther: [$('.list_tag').children('a').text()],
              labelLink: url,
              pageSize: labelPages
            }

            resolve(objLabelInfo)
          }
        })
    })
  }

  // 删除多余重复标签
  deleteRepeat() {
    getFile('label.js').then((arr) => {
      console.log(arr.length);
      for (let i = 0; i < arr.length; i++) {
        for (let j = i+1; j < arr.length; j++) {
          if (arr[i].labelLink === arr[j].labelLink) {
            // arr.splice(i, 1);
          }
        }
      }
      console.log(arr.length);
      // fs.appendFile(`${__dirname}/album2.js`, `${JSON.stringify(arr, null, 2)},`, (err) => {
      //   if (err) {
      //     throw err
      //   }
      // })
    })
  }



}

/**
 * 获取对应标签里的所有专辑
 */
class Album{
  constructor() {
    this.albumInfo = {
      label: '',
      title: '',  // 标题
      desc: '',   // 描述
      coverUrl: '' // 封面链接
    }
  }

  main() {
    let arrLabel = [];
    getFile('label.js').then((arr) => {
      // 循环当前数组，取出url，发起请求，获取当前末页 limitLen， 循环limitLen，获取每一页的ablums
      let arrAlbums = [];

      arr.map((labelItem, labelIndex, labelArr) => {
        for (let i = 0; i < labelItem.pageSize; i++) {
          let url = '';
          if (i === 0 ) {
            url = labelItem.labelLink
          } else {
            url = `${labelItem.labelLink.slice(0, labelItem.labelLink.indexOf('.html'))}_${i+1}.html`
          }
          superagent
            .get(url)
            .use(throttle.plugin())
            .set({
              'Cookie': 'Hm_lvt_63a864f136a45557b3e0cbce07b7e572=1532689632Hm_lpvt_63a864f136a45557b3e0cbce07b7e572=1534031600',
              'Referer': 'http://www.27270.com/'
            })
            .charset('gbk')
            .end(function (err, res) {
              if (err) {
                console.log('err.status', err)
              } else {
                let $ = cheerio.load(res.text);
                let arrA = $('#Tag_list').children('li').children('a');
                let numAlength = arrA.length;
                let objAlbum = {};
                arrA.map((aIndex, aItem) => {
                  // console.log(`${labelItem.labelName} --- ${i}页 --- ${$(aItem).attr('title')}`);
                  objAlbum = {
                    albumId: generatorRandomString(20),
                    labelId: `${labelItem.labelId}`,
                    url: `${$(aItem).attr('href')}`,
                    title: `${$(aItem).attr('title')}`,  // 标题
                    desc: '',   // 描述
                    coverUrl: `${$(aItem).children('img').attr('src')}` // 封面链接
                  }
                  fs.appendFile(`${__dirname}/album.js`, `${JSON.stringify(objAlbum, null, 2)},`, (err) => {
                    if (err) {
                      throw err
                    }
                  })
                })
              }
            })
        }
      })
    })
  }

  // 获取专辑的描述内容，和总页数
  getAlbumInfo() {
    let arrAlbum = []
    fs.readFile(`${__dirname}/album.js`, (err, data) => {
      if (err) {
        console.log(err)
        return 0
      }
      arrAlbum = JSON.parse(data);
      let index = 0
      // let arrLeft = [
      //   'http://www.27270.com/ent/meinvtupian/2017/170137.html',
      //   'http://www.27270.com/ent/meinvtupian/2016/168540.html',
      //   'http://www.27270.com/ent/mingxingbagua/2015/121782.html',
      //   'http://www.27270.com/ent/mingxingtuku/2015/44897.html',
      //   'http://www.27270.com/qita/mengtu/2015/31641.html',
      //   'http://www.27270.com/ent/lianglimeimo/2016/164029.html',
      //   'http://www.27270.com/ent/meinvtupian/2017/189356.html',
      //   'http://www.27270.com/ent/mingxingtuku/2015/42403.html',
      //   'http://www.27270.com/ent/mingxingtuku/2015/46079.html',
      // ]
      arrAlbum.map((albumItem, albumIndex, albumArr) => {
        // if (arrLeft.includes(albumItem.url)) {
          superagent
            .get(albumItem.url)
            .use(throttle.plugin())
            .set({
              'Cookie': 'Hm_lvt_63a864f136a45557b3e0cbce07b7e572=1532689632Hm_lpvt_63a864f136a45557b3e0cbce07b7e572=1534031600',
              'Referer': 'http://www.27270.com/'
            })
            .charset('gbk')
            .end(function (err, res) {
              if (err) {
                // console.log('err.status', albumItem.url)
                appendFile('log/albumerror.log', albumItem.url + '\n');
              } else {
                console.log('index :', ++index);
                let $ = cheerio.load(res.text);
                Object.assign(albumItem, {
                  desc: $('.articleV4Desc').children('p').text() || '',
                  coverUrl: $('#picBody').find('img').attr('src') || '',
                  pageSize: $('#pageinfo').attr('pageinfo') || '0'
                });
                fs.appendFile(`${__dirname}/album1.js`, `${JSON.stringify(albumItem, null, 2)},\n`, (err) => {
                  if (err) {
                    throw err;
                  }
                })
              }
            })
          // }
      })
    })
  }

  // 排除专辑里重复的内容
  deleteRepeat() {
    let index = 0
    getFile('album1.js').then((arr) => {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[i].url === arr[j].url) {
            arr.splice(j, 1)
            index++
          }
        }
      }
      console.log('index :', index);
      if (index !== 0) {
        fs.writeFile(`${__dirname}/album.js`, `${JSON.stringify(arr, null, 2)},`, (err) => {
          if (err) {
            throw err
          }
        })
      } else {
        console.log('没有重复值')
      }
    })
  }
}

class Img {
  constructor(){
    this.imgInfo = {
      label: '',
      title: '',  // 标题
      desc: '',   // 描述
      coverUrl: '' // 封面链接
    }
  }

  getAllAlbum() {
    Promise.all([getFile(`album1.js`), getFile(`log/imgsuccess.log`)])
      .then((values) => {
        let arrAll = values[0];
        let arrSuccess = values[1] || [];
        arrAll.map((albumItem, albumIndex, albumArr) => {
          let pageSize = albumItem.pageSize;
          for (let i = 0; i < pageSize; i++) {
            let url = ''
            if (i === 0) {
              url = albumItem.url;
            } else {
              url = `${albumItem.url.slice(0, albumItem.url.indexOf('.html'))}_${i+1}.html`
            }
            let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            // @todo 判断是否已经在池中出现
            if (!arrSuccess.includes(url)) {
              superagent
                .get(url)
                .timeout({
                  response: 5000,  // Wait 5 seconds for the server to start sending,
                  deadline: 60000, // but allow 1 minute for the file to finish loading.
                })
                .set({ 'User-Agent': userAgent })
                // .proxy(proxy)
                .use(throttle.plugin())
                .set({
                  'Cookie': 'Hm_lvt_63a864f136a45557b3e0cbce07b7e572=1536940152; Hm_lpvt_63a864f136a45557b3e0cbce07b7e572=1536940716',
                  'Referer': 'http://www.27270.com/',
                  "Proxy-Connection": "keep-alive"
                  // 'Proxy-Authorization': `Basic ${appKey}`
                })
                .charset('gbk')
                .end(function (err, res) {
                  if (err) {
                    appendFile('log/imgerror.log', `"${url}",`)
                  } else {
                    console.log(`"url: ${url}",`)
                    appendFile('log/imgsuccess1.log', `"${url}",`)
                    let $ = cheerio.load(res.text);
                    let objImg = {
                      albumId: albumItem.albumId || '',
                      imgId: generatorRandomString(20),
                      imgUrl: $('#picBody').find('img').attr('src') || ''
                    }
                    fs.appendFile(`${__dirname}/imgs.js`, `${JSON.stringify(objImg, null, 2)},\n`, (err) => {
                      if (err) {
                        throw err;
                      }
                    })
                  }
                })
            }
          }
        })
      })
  }

}

// 工具函数
// 生成随机id
function generatorRandomString(length) {
  let arrChar = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let charLen = arrChar.length;
  let str = '';
  for (let i = 0; i < length; i++) {
    str += arrChar[Math.floor(Math.random() * charLen)]
  }
  return str;
};

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

// 向某个文件添加 append
function appendFile(filename, data) {
  fs.appendFile(`${__dirname}/${filename}`, `${data}\n`, (err) => {
    if (err) {
      throw err;
      console.log(data);
    }
  })
}


// let label = new Label();
// label.getAllLabelsInfos()
// label.deleteRepeat()

// let album = new Album();
// album.main()
// album.getAlbumInfo()
// album.deleteRepeat() // 去重


let img = new Img();
img.getAllAlbum();


