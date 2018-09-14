/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-14 21:14:00
 * @Description: 图片实体
 */

/**
 *
 * @param {String} imgUrl 图片链接
 * @param {String} albumId 图片所在专辑id
 */


/**
 * CREATE TABLE base_img_tbl (
 *   imgId int auto_increment primary key,
 *   imgUrl varchar(255) NOT NULL,
 *   albumId int(55)
 * )
 */


class Img {
  constructor(imgUrl, imgId) {
    this.imgUrl = imgUrl;
    this.imgId = imgId;
  }

  funcInsertSql(arrImg) {
    let sql = `insert into base_img_tbl (imgUrl, imgId) values `;
    arrImg.map((imgItem, imgIndex, imgArr) => {
      if (imgIndex !== imgArr.length - 1) {
        sql = `${sql}("${imgItem.imgUrl}", "${imgItem.imgId}"),`
      } else {
        sql = `${sql}("${imgItem.imgUrl}", "${imgItem.imgId}");`
      }
    })
    return sql.replace(/[\r\n]/g, "");
  }
}

exports = module.exports = Img;