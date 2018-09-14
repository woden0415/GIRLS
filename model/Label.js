/*
 * @Author: woden0415@163.com
 * @Date: 2018-08-13 22:31:20
 * @Description: 标签实体
 */

/**
 *
 * @param {String} labelName 标签名
 * @param {String} lableDesc 标签描述
 * @param {Array} labelOther 相关标签
 */

 /**
  * CREATE TABLE base_label_tbl (
  *   labelId int auto_increment primary key,
  *   labelName varchar(255) NOT NULL,
  *   labelDesc varchar(255),
  *   labelOther varchar(255)
  * )
  */


class Label {
  constructor(labelName, labelDesc, labelOther){
    this.labelName = labelName;
    this.labelDesc = labelDesc;
    this.labelOther = labelOther;
  }

  funcInsertSql(arrLabels) {
    let sql = `insert into base_label_tbl (labelId, labelName, labelDesc, labelOther) values `;
    // arrLabels.length = 4;
    arrLabels.map((labelItem, labelIndex, labelArr) => {
      if (labelIndex !== labelArr.length - 1) {
        sql = sql + `("${labelItem.labelId}", "${labelItem.labelName}", "${labelItem.labelDesc}", "${labelItem.labelOther}"),`
      } else {
        sql = sql + `("${labelItem.labelId}", "${labelItem.labelName}", "${labelItem.labelDesc}", "${labelItem.labelOther}");`
      }
    })
    // console.log(sql.replace(/[\r\n]/g,""))
    return sql.replace(/[\r\n]/g,"");
  }

}

exports = module.exports = Label;