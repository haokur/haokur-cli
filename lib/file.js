const fs = require("fs");
var readline = require("readline");

function isExist$(dir) {
  return new Promise((resolve, reject) => {
    fs.exists(dir, isExist => {
      if (isExist) {
        console.log("存在对应路径", dir);
        resolve("exist");
      } else {
        reject("not exist");
      }
    });
  });
}

/**是否为文件夹的同步方法 */
function isDirectory(dir) {
  let stat = fs.statSync(dir);
  return stat.isDirectory();
}

function isDirectory$(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (!stat.isDirectory()) {
        reject("not a directory");
      } else {
        resolve();
      }
    });
  });
}

function isFile$(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (!stat.isFile()) {
        reject("not a file");
      } else {
        resolve();
      }
    });
  });
}

function isExistDir$(dir) {
  // 先判断是否存在,再判断是否是文件夹
  return isExist$(dir).then(() => {
    return isDirectory$(dir);
  });
}

function isExistFile$(dir) {
  return isExist$(dir).then(() => {
    return isFile$(dir);
  });
}

// 逐行读取
function eachFileLine(fileDir, eachLineCb) {
  return new Promise((resolve, reject) => {
    var fReadStream = fs.createReadStream(fileDir);
    var objReadLine = readline.createInterface({
      input: fReadStream
    });
    objReadLine.on("line", lineStr => {
      // 接收回调改变回来的值
      eachLineCb(lineStr);
    });
    objReadLine.on("close", () => {
      resolve();
    });
  });
}

module.exports = {
  isExist$,
  isExistDir$,
  isExistFile$,
  eachFileLine,
  isDirectory$,
  isDirectory,
  isFile$
};
