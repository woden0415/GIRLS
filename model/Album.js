/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-14 20:44:51
 * @Description: 专辑
 */

/**
 *
 * @param {String} albumTitle 专辑标题
 * @param {String} albumDesc 专辑描述
 * @param {String} labelId 标签Id
 * @param {String} coverUrl 封面链接
 */

/**
 * CREATE TABLE base_album_tbl (
 *   albumId int auto_increment primary key,
 *   albumTitle varchar(255) NOT NULL,
 *   albumDesc varchar(255),
 *   labelId int(55)
 *   coverUrl varchar(255)
 * )
 */

var DB = require('../util/db')


var db = new DB();


class Album {
  constructor(albumTitle, albumDesc, labelId, coverUrl) {
    this.albumTitle = albumTitle;
    this.albumDesc = albumDesc;
    this.labelId = labelId;
    this.coverUrl = coverUrl;
  }

  funcInsertSql(arrAlbum) {
    let sql = `insert into base_album_tbl (albumTitle, albumDesc, labelId, coverUrl) values `;
    arrAlbum.map((albumItem, albumIndex, albumArr) => {
      if (albumIndex !== albumArr.length - 1) {
        sql = `${sql}("${albumItem.title}", "${albumItem.desc}", "${albumItem.labelId}", "${albumItem.coverUrl}"),`
      } else {
        sql = `${sql}("${albumItem.title}", "${albumItem.desc}", "${albumItem.labelId}", "${albumItem.coverUrl}");`
      }
    })
    return sql.replace(/[\r\n]/g, "");
  }

  funcSelectAlbum(pageNo, pageSize) {
    return new Promise((resolve) => {
      let sql = `select * from base_album_tbl limit ${(pageNo - 1) * (pageSize)}, ${pageSize};`
      db.exectSql(sql, (err, results, fields) => {
        if (err) {
          throw err;
          return 0;
        }
        resolve(results)
      })
    })
  }
}

exports = module.exports = Album;
