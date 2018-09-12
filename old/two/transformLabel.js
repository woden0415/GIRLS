/*
* @Author: wang_donga@Ctrip.com
* @Date: 2018-08-20 15:38:38
* @Description: 为label添加随机字符串
*/
var fs = require('fs');
class RandomString {
  /**
  * @param {String} length 新加入的字符串长度
  * @param {Array} arr 已有的数组
  */
  constructor(length, arr) {
    this.length = length;
    this.arr = arr;
  }

  /**
  * @description 生成length长度字符串
  * @param {Number}} length 字符串编码的长度
  */
  generatorRandomString(length) {
    let arrChar = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let charLen = arrChar.length;
    let str = '';
    for (let i = 0; i < length; i++) {
      str += arrChar[Math.floor(Math.random() * charLen)]
    }
    return str;
  };

  /**
  * @description 排除已有的
  * @param {String} string 新加入的字符串
  * @param {Array} existArr 已有的数组
  */
  addNewString(string, index,  existArr) {
    // if(existArr.indexOf(string) > -1) {
    //   this.addNewString(this.generatorRandomString(this.length), existArr)
    // } else {
    //   existArr.push(string);
    // }
    existArr[index].labelId = string;
  }

  main() {
    let arr1 = JSON.parse(this.arr);
    let len1 = this.length;
    let _this = this;
    console.log(arr1 instanceof Array);
    arr1.map((item, index, arr) => {
      item.labelId = _this.generatorRandomString(len1)
      // _this.addNewString(this.generatorRandomString(len1), index, arr);
    })
    return JSON.stringify(arr1);
  }
}



function readFile() {
  return new Promise((resolve) => {
    fs.readFile('./label.js', 'utf8', (err, data) => {
      if (err) {
        throw err;
        return ;
      }
      resolve(data)
    })
  })
}

readFile().then((result) => {
  let arr = [];
  console.log(JSON.parse(result).length);
  console.log(JSON.parse(result) instanceof Array)
  let arrLabel = JSON.parse(result);
  if (arrLabel.length > 0) {
    arr = result
    newArr = arr;
    return new Promise((resolve) => {
      resolve(newArr)
    })
  }
}).then((arrAll) => {
  arrAll = arrAll || [];
  let objRaStr = new RandomString(20, arrAll)
  arrAll = objRaStr.main();
  fs.writeFile('newLables.js', `${arrAll}`, (err) => {
    if (err) {
      throw err;
    }
    console.log('success')
  })
})