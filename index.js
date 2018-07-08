var superagent = require('superagent')
var cheerio = require('cheerio')
var fs = require('fs')


// @todo 获取list page数组
function getListPage() {
  let page = 1;  // 最大值188
  let length = 189;
  let listArr = [];
  for (let i = 1; i <= length; i++) {
    listArr.push(`http://www.27270.com/ent/meinvtupian/list_11_${i}.html`);
  }
  return listArr
}

// @todo 获取当前页所有的封面链接
/**
 *
 * @param {string} pageUrl 当前页面的链接
 */
function getOnePage(pageUrl, callback) {
  var newArr = []
  var promiseAa = new Promise((resolve) => {
    superagent
      .get(pageUrl)
      .end(function (err, res) {
        if (err) {
          // console.log('30-------' + err)
        } else {
          let $ = cheerio.load(res.text)
          var girlArr = $('.MeinvTuPianBox').find('.MMPic')
          for (let i = 0; i < girlArr.length; i++) {
            newArr.push(girlArr[i].attribs.href)
          }
          resolve(newArr)
        }
      })
  })
  return promiseAa
}

var asyncReadFile = function () {
  let Arr = []
  let arr1 = getListPage()

  arr1.forEach((pageUrl, index) => {
    let promiseIn = new Promise(resolve => {
      getOnePage(pageUrl).then((value) => {
        let str = ''
        if (Array.isArray(value)) {
          value.forEach(function (item, index) {
            str += `${item}\n`
          })
        }
        resolve(str)
      })
    })
    promiseIn.then((str) => {
      fs.appendFileSync('./message.txt', str)
    })
  })
}
// asyncReadFile()




// @todo 获取每一个封面对应内容的多数图 详情页
function getMoreOnPage(pageUrl) {
  let urlPrefix = pageUrl.slice(0, pageUrl.indexOf('.html'))
  let newUrl = ''
  let imgUrlArr = []
  for (let i = 1; i <= 10; i++) {
    if (i === 1) {
      newUrl = pageUrl;
    } else {
      newUrl = `${urlPrefix}_${i}.html`
    }

    new Promise((resolve) => {
      console.log(`发送请求至${newUrl}:-------`)
      superagent
        .get(newUrl)
        .end(function (err, res) {
          if (err) {
            console.log('line86---------' + err.toString())
          } else {
            let $ = cheerio.load(res.text)
            let imgUrl = $("#picBody").find("img").attr('src');
            resolve(imgUrl)
          }

        })
    }).then(imgUrl => {
      fs.appendFileSync('./images1.txt', imgUrl + '\n')
    })
  }
}

// getMoreOnPage('http://www.27270.com/ent/meinvtupian/2018/262099.html')

// 从文本读取
function readFile() {
  let str = fs.readFileSync('./message.txt', 'utf8')
  let arr = str.split('\n')
  console.log(arr.length)
  // arr.map(function (pageUrl, index) {
  //   if (index%5 === 0) {
  //     getMoreOnPage(pageUrl)
  //   }
  // })
  let i = 0;
  var timer = setInterval(function () {
    getMoreOnPage(arr[i]);
    i++
    if (i >= arr.length) {
      clearInterval(timer)
    }
  }, 2000)
}

readFile()
