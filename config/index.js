
const wflowDefaultConf = require('./wflow.default.config')
var wflowUserConf = {};
try {
  var processRunDir = process.cwd();
  wflowUserConf = require(processRunDir + '/wflow.config.js')
}
catch (e) {
  // console.log('没有用户自定义配置')
}

/**
 * 处理配置相关
 */

// 合并用户和应用默认的配置
exports.mergeConfig = function () {
  return Object.assign(wflowDefaultConf, wflowUserConf)
}