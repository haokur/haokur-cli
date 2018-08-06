#!usr/bin/env node

const { mergeConfig } = require('../config')
let wflowConf = mergeConfig();

// console.log(wflowConf);

const fs = require('fs')
const path = require('path')

const { getRunDir } = require('../lib/utils')
const processRunDir = getRunDir();
const { isExistDir$, isExistFile$ } = require('../lib/file')

// 抽取命令
let [_, __, order, ...createNames] = process.argv

let {
  orders: recognizableOrders,
} = wflowConf.g;

let recognizableOrderKeys = Object.keys(recognizableOrders)

if (isCmdRecoginzable) {
  createNames.forEach(createName => {

    // 将要创建的目录
    let _willCreateDir = getWillCreateDir(order, createName)

    // 判断是否已经存在该文件夹
    isExistDir$(_willCreateDir)
      .then(flag => {
        console.log(flag)
        // 文件夹已存在,直接跳过,进行下一步
      })
      .catch(err => {
        // 不存在,则开始创建文件夹
        return new Promise((resolve, reject) => {
          fs.mkdir(_willCreateDir, '0777', () => {
            resolve()
          }, () => reject('创建失败'))
        })
      })
      .then(() => {
        // 根据模板生成相关文件
        generateAndWriteFile(order, _willCreateDir, createName)
      })
      .catch(err => {
        console.log(err)
      })
  })
}
else {
  console.log('不可识别的命令')
}

// 检查命令是否可识别
function isCmdRecoginzable() {
  return order && recognizableOrderKeys.includes(order) && createNames.length
}

// 拼接生成将要创建生成的文件夹
function getWillCreateDir(order, createName) {
  if (wflowConf.g.getWillCreateDir) {
    return wflowConf.g.getWillCreateDir(order, createName);
  }
  else {
    // let _dir = ''
    // let { target } = recognizableOrders[order];
    // _dir = target.dir.replace(/{{order}}/g, order)
    //   .replace(/{{createName}}/g, createName)
    // return path.resolve(processRunDir, _dir)
    return ''
  }
}

// 读取模板,并且写入文件
function generateAndWriteFile(order, createDir, createName) {
  // 定位到模板
  let orderTargetConf = wflowConf.g.orders[order].target;

  Object.keys(orderTargetConf).forEach(key => {
    let _filePath = path.resolve(createDir, orderTargetConf[key].replace(/{{createName}}/g, createName));
    isExistFile$()
      .catch(() => {
        return getOrderTemplate(order, key, createName)
          .then(tplStr => {
            // 文件不存在,则开始创建文件
            fs.writeFile(_filePath, tplStr, () => {
              console.log(`创建 ${createName} ${key} 成功`);
            })
          })
      })
      .catch(err => {
        console.log(err)
      })
  })
}

// 获取模板内容
function getOrderTemplate(order, type, createName) {
  if (wflowConf.g.getOrderTemplate) {
    return wflowConf.g.getOrderTemplate(order, type, createName);
  }
  else {
    return new Promise((resolve, reject) => {
      let orderSourceConf = wflowConf.g.orders[order].source;
      let _sourcePath = path.join(processRunDir, orderSourceConf[type]);
      let _tplStr = fs.readFileSync(_sourcePath)
      resolve(_tplStr.toString().replace(/{{createName}}/g, createName))
    })
  }
}
