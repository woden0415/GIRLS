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
  rate: 20,          // how many requests can be sent every `ratePer`
  ratePer: 1000,   // number of ms in which `rate` requests may be sent
  concurrent: 2     // how many requests can be sent concurrently
})


// 获取标签数据
class Label {
  constructor() {}

  getAllLabelsInfos() {
    let url = 'http://www.27270.com/tag/'
    let time = 0;
    let arrList = this.getAllLabelsLink(url);
    arrList.then((result) => {
      console.log('result.length', result.length);
      result.map((urlItem, index, arr) => {
        this.getLabelDetail(urlItem).then((aa)=>{
          (function(url, i, a){
            console.log(`请求链接: ${i}    ----     ${url}`);
            if (i === 0) {
              fs.appendFileSync(`${__dirname}/label.js`, `[${JSON.stringify(aa, null, 2)},\n`)
            } else if (i === arr.length - 1) {
              fs.appendFileSync(`${__dirname}/label.js`, `${JSON.stringify(aa, null, 2)}]`)
            } else {
              fs.appendFileSync(`${__dirname}/label.js`, `${JSON.stringify(aa, null, 2)},\n`)
            }
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
    let arrGirls = [3]
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
    this.getAllLabelsInfos1().then((arr) => {
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
                    label: `${labelItem.labelName}`,
                    url: `${$(aItem).attr('href')}`,
                    title: `${$(aItem).attr('title')}`,  // 标题
                    desc: '',   // 描述
                    coverUrl: `${$(aItem).children('img').attr('src')}` // 封面链接
                  }
                  if (labelIndex === 0 && i === 0 && aIndex === 0) {
                    fs.appendFileSync(`${__dirname}/album.js`, `[${JSON.stringify(objAlbum, null, 2)},\n`)
                  } else if (labelIndex === labelArr - 1 && i === labelItem.pageSize - 1 && aIndex === numAlength - 1) {
                    fs.appendFileSync(`${__dirname}/album.js`, `${JSON.stringify(objAlbum, null, 2)}]`)
                  } else {
                    fs.appendFileSync(`${__dirname}/album.js`, `${JSON.stringify(objAlbum, null, 2)},\n`)
                  }
                })
              }
            })
        }
      })
    })
  }


  // @todo 读取所有label的labelLink
  // @todo 进入label页面，获取页数， 循环页数，获取当前页面的专辑 coverUrl，标注好当前的label

  /**
   * @description 返回存储的所有标签信息
   */
  getAllLabelsInfos1() {
    let promise1 = new Promise((resolve) => {
      fs.readFile(`${__dirname}/label.js`, (err, data)=> {
        if (err) {
          console.log(err);
          return 0
        }
        resolve(JSON.parse(data))
      })
    })
    return promise1
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
      arrAlbum.map((albumItem, albumIndex, albumArr) => {
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
              console.log('err.status', err)
            } else {
              // console.log(`${albumItem.label} --- ${albumItem.title}`)
              let $ = cheerio.load(res.text);
              Object.assign(albumItem, {
                desc: $('.articleV4Desc').children('p').text(),
                coverUrl: $('#picBody').find('img').attr('src'),
                pageSize: $('#pageinfo').attr('pageinfo')
              });
              fs.appendFileSync(`${__dirname}/album1.js`, `${JSON.stringify(albumItem, null, 2)},\n`)
            }
          })
      })
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

  // 获取所有专辑、其首页链接、页数
  getAllAlbum() {
    let arrAlbum = [];
    fs.readFile(`${__dirname}/album1.js`, (err, data) => {
      if (err) {
        console.log('errAllAlbum', err)
        return 0
      }
      arrAlbum = JSON.parse(data);
      arrAlbum.map((albumItem, albumIndex, albumArr) => {
        for (let i = 0; i < albumItem.pageSize; i++) {
          let url = ''
          if (i === 0) {
            url = albumItem.url;
          } else {
            url = `${albumItem.url.slice(0, albumItem.url.indexOf('.html'))}_${i+1}.html`
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
              let objImg = {
                album: albumItem.title,
                imgUrl: $('#picBody').find('img').attr('src'),
              }
              fs.appendFileSync(`${__dirname}/imgs.js`, `${JSON.stringify(objImg, null, 2)},\n`)
            }
          })
        }
      })
    })
  }

}



// let label = new Label();
// label.getAllLabelsInfos()

// let album = new Album();
// album.main()
// album.getAlbumInfo()

// let img = new Img();
// img.getAllAlbum();


