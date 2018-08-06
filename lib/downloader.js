
const exec = require('child_process').exec;

module.exports = function (projectName, downloadUrl) {
  var gitDownCmdStr = `git clone ${downloadUrl} ${projectName}`;

  return new Promise((resolve, reject) => {
    exec(gitDownCmdStr, function (err, stdout, stderr) {
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