var fs = require('fs');


/**
 * @desc 为img添加对应的albumid
 */
function imgAddAlbumId () {
  let proImg = new Promise((resolve) => {
    fs.readFile(`${__dirname}/imgs.js`, 'utf-8', (err, data) => {
      if (err) {
        console.log('imgs', err)
      } else {
        console.log(data)
        resolve(JSON.parse(data));
      }
    })
  })

  let proAlbum = new Promise((resolve) => {
    fs.readFile(`${__dirname}/album1.js`, 'utf-8', (err, data) => {
      if (err) {
        console.log('album1', err)
      } else {
        resolve(JSON.parse(data))
      }
    })
  })

  Promise.all([proImg, proAlbum]).then((all) => {
    let arr1 = all[0];
    let arr2 = all[1];
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        if (arr1[i].album === arr2[j].title) {
          arr1[i].albumId = j + 1;
          break;
        }
      }
    }
    console.log('success111');
    fs.writeFile(`${__dirname}/aa.js`, JSON.stringify(arr1), (err) => {
      if (err) console.log(err) ;
      console.log('文件已保存！');
    });
  })
}

imgAddAlbumId()