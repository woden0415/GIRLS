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
      console.log('----------------');
      console.log('object', sql);
      db.exectSql(sql, (err, results, fields) => {
        if (err) {
          throw err;
          return 0;
        }
        resolve(results)
      })
    })
  }

  /**
   *
   * @param {String} albumId 专辑id
   */
  funcGetAlbumInfo(albumId) {
    return new Promise((resolve) => {
      let sql = `SELECT album.albumId, album.albumTitle, album.coverUrl, album.albumDesc, img.imgId, img.imgUrl FROM base_img_tbl AS img, relation_img_album_tbl AS ria, base_album_tbl as album WHERE img.imgId = ria.imgId AND ria.albumId = ${albumId} AND album.albumId = ${albumId};`
      db.exectSql(sql, (err, results, fields) => {
        if (err) {
          throw err;
          return 0;
        }
        let objAlbumInfo = {
          id: '',
          title: '',
          coverUrl: '',
          albumDesc: '',
          imgLists: []
        }
        if (results.length > 0) {
          objAlbumInfo.id = results[0].albumId;
          objAlbumInfo.title = results[0].albumTitle;
          objAlbumInfo.coverUrl = results[0].coverUrl;
          objAlbumInfo.albumDesc = results[0].albumDesc;
          results.map((item, index, arr) => {
            objAlbumInfo.imgLists.push(item.imgUrl)
          })
        }
        resolve(objAlbumInfo);
      })
    })
  }
}

exports = module.exports = Album;
