const fs = require('fs')

function isExist$(dir) {
  return new Promise((resolve, reject) => {
    fs.exists(dir, isExist => {
      if (isExist) {
        console.log('存在对应路径', dir)
        resolve('exist')
      }
      else {
        reject('not exist')
      }
    })
  })
}

function isDirectory$(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (!stat.isDirectory()) {
        reject('not a directory')
      }
      else {
        resolve()
      }
    })
  })
}

function isFile$(dir) {
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err, stat) => {
      if (!stat.isFile()) {
        reject('not a file')
      }
      else {
        resolve()
      }
    })
  })
}

function isExistDir$(dir) {
  // 先判断是否存在,再判断是否是文件夹
  return isExist$(dir)
    .then(() => {
      return isDirectory$(dir)
    })
}

function isExistFile$(dir) {
  return isExist$(dir)
    .then(() => {
      return isFile$(dir);
    })
}

module.exports = {
  isExist$,
  isExistDir$,
  isExistFile$
}