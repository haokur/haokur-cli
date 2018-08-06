#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const exec = require('child_process').exec;

const { isExistDir$ } = require('../lib/file')
const { loadingStart, loadingSuccess, loadingFail } = require('../lib/loading')
const download = require('../lib/downloader')
const { mergeConfig } = require('../config')
const { downloadUrls } = mergeConfig()

commander.usage('<project-name>').parse(process.argv)

let projectName = commander.args[0]

if (!projectName) {
  commander.help();
}
else {
  const processRunDir = process.cwd(); // 命令执行目录
  const willCreateDir = path.resolve(processRunDir, projectName)

  isExistDir$(willCreateDir)
    .then(() => {
      console.log(`项目${projectName}已经存在`)
    })
    .catch(() => {
      // 不能存在文件时,创建
      console.log('该项目名可用,开始执行创建...')
      // 流程: 选择模板 => 下载模板 => 配置 package.json => 安装依赖并运行
      chooseTemplate$()
        .then(answers => {
          let type = answers.templateType;
          let downloadUrl = downloadUrls[type]
          loadingStart(`开始下载模板,下载地址为${downloadUrl}`)
          return download(projectName, downloadUrl)
        })
        .then(() => {
          loadingSuccess('下载完成,开始修改部分配置文件')
          return generateProject$(willCreateDir, projectName)
        })
        .then(() => {
          loadingStart('初始化完成,安装依赖中...')
          return npmInstallAndRun$(willCreateDir);
        })
        .then(() => {
          loadingSuccess('初始化项目完成.')
        })
        .catch(err => {
          loadingFail(err);
        })
    })
}

// 选择模板
function chooseTemplate$() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'templateType',
      message: '请选择模板',
      choices: Object.keys(downloadUrls).map(item => {
        return { name: item }
      })
    }
  ])
}

// 交互式自定义一些修改
function generateProject$(target, projectName) {
  var pkgPath = path.join(target, 'package.json')
  var defaultPkg = require(pkgPath)
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        name: 'name',
        message: '请输入项目名称',
        default: projectName
      },
      {
        name: 'version',
        message: '请输入项目版本',
        default: '1.0.0'
      },
      {
        name: 'description',
        message: '请输入项目描述',
        default: projectName
      },
    ])
      .then(answers => {
        var userPkgConfig = Object.assign(defaultPkg, answers);
        fs.writeFileSync(pkgPath, JSON.stringify(userPkgConfig));
        resolve();
      })
  })
}

// 安装依赖,并且启动应用
function npmInstallAndRun$(target) {
  return new Promise((resolve, reject) => {
    exec(`cd ${target} && npm install && npm start`, function (err, stdout, stderr) {
      if (err) {
        console.log(stderr)
        reject(err)
      } else {
        console.log(stdout)
        resolve()
      }
    });
  })
}


