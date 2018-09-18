
const fs = require("fs")
const path = require("path")

/**
 * 工具包
 */

//  获取命令行执行的根目录
exports.getRunDir = function () {
  return process.cwd();
}

// 遍历文件夹目录
exports.readDir = function (path) {
  fs.readdir(path, function (err, menu) {
    if (!menu)
      return;
    menu.forEach(function (ele) {
      fs.stat(path + "/" + ele, function (err, info) {
        if (info.isDirectory()) {
          console.log("dir: " + ele)
          readDir(path + "/" + ele);
        } else {
          console.log("file: " + ele)
        }
      })
    })
  })
}