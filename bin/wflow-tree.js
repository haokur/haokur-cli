#!usr/bin/env node

const fs = require('fs');
const path = require('path');

const { getRunDir, readDir } = require('../lib/utils');
const { isDirectory$, isDirectory } = require('../lib/file');

// 打印目录树
let rootDir = getRunDir();

// 打印所有子项目
// readFold(rootDir);
console.log(rootDir + '/');
readFold(rootDir);

function readFold(foldPath) {
    let files = fs.readdirSync(foldPath);
    for (var i = 0; i < files.length; i++) {
        let fileName = files[i];
        let filePath = path.join(foldPath, '/', fileName);
        let stack = fileStackNumByFileName(filePath, rootDir);
        if (isDirectory(filePath, rootDir)) {
            console.log(`${'|   '.repeat(stack)}├── ${fileName}/`);
            if (!fileName.includes('node_modules')) {
                readFold(filePath);
            }
        } else {
            // 如果是数组中的最后一个
            if (i === files.length - 1) {
                console.log('|   '.repeat(stack) + '└── ' + fileName);
            } else {
                console.log('|   '.repeat(stack) + '├── ' + fileName);
            }
        }
    }
}

// 获取当前所属层级
function fileStackNumByFileName(fileName, rootPath) {
    let extPath = fileName.replace(rootPath, '');
    let stack = 0;
    extPath.replace(/\//g, () => {
        stack++;
    });
    return stack - 1;
}
