const ora = require('ora')

global.spinner = null;

function loadingStart(str) {
  global.spinner = ora(`${str},请稍候...`)
  global.spinner.start()
}

function loadingSuccess(str = '') {
  global.spinner.succeed(str)
}

function loadingFail() {
  global.spinner.fail()
}

module.exports = {
  loadingStart,
  loadingSuccess,
  loadingFail,
}