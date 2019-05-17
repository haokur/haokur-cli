var fs = require("fs");
var archiver = require("archiver");

// 判断路径是否为文件夹
function isDir(filePath) {
  return fs.statSync(filePath).isDirectory();
}

// 判断路径是否为纯文件
function isFile(filePath) {
  return fs.statSync(filePath).isFile();
}

/**
 * => 打包压缩文件或文件夹
 * @param {string} inputFile 需要压缩的文件或文件夹(绝对路径)
 * @param {string} outputFile 需要输出到的文件夹(.zip,.rar等格式,需绝对路径)
 * @param {string} destPath 强行更改打包后的路径层次
 *
 * 例1: zipFile('User/root/test.js','User/root/test.zip','test2.js')
 * 将 `User/root/test.js` 的文件压缩到 `User/root/test.zip`, 解压 `User/root/test.js`
 *
 * 例2: zipFile('User/root/test','User/root/test.zip','test/dist')
 * 将 `User/root/test` 文件夹压缩到 `User/root/test.zip`, 解压得到 `User/root/test`
 * 假如 `User/root/test/1.js` 存在, 则存在解压后的 `User/root/test/dist/1.js`
 */
function zipFile(inputFile, outputFile, destPath) {
  console.log(inputFile, outputFile, destPath);
  // 创建可写流(即目标zip文件)
  var output = fs.createWriteStream(outputFile);
  var archive = archiver("zip", {
    zlib: { level: 9 }
  });

  return new Promise((resolve, reject) => {
    // 压缩成功
    output.on("close", function() {
      resolve(archive.pointer() / 1024 / 1024 + "M");
    });

    // 压缩失败
    archive.on("error", function(err) {
      reject(err);
    });

    // 开始压缩
    archive.pipe(output); // 管道流写入可写流
    if (isFile(inputFile)) {
      archive.append(fs.createReadStream(inputFile), { name: destPath });
    } else if (isDir(inputFile)) {
      archive.directory(inputFile, destPath); // destPath 定义了解压后的文件嵌套
    }
    archive.finalize(); // 标志结束,关闭可写流
  });
}

exports.zipFile = zipFile;
