const fs = require('fs');
const chokidar = require('chokidar');
const sass = require('node-sass');
const bs = require('browser-sync').create();
const opn = require('opn');

// 运行命令目录
var cmdRunDir = process.cwd();

// 监听 sass 文件改变,生成 css 文件
chokidar.watch(cmdRunDir, {
  // ignored: /(^|[\/\\])\../
  ignored: '**/node_modules'
}).on('add', (event, path) => {
  // console.log(event, path);
})
  .on('change', (path, stats) => {
    var isScssFile = path.slice(-5) === '.scss';
    if (isScssFile) {
      sass.render({
        file: path,
      }, function (err, result) {
        // console.log(result);
        fs.writeFile(path.replace('.scss', '.css'), result.css, function (err) {
          if (!err) {
            // console.log('写入成功回调')
          }
        })
      });
    }
  });


// 监听 HTML 和 CSS 更改事件并重新加载
bs.watch("*.html").on("change", bs.reload);
bs.watch("*.js").on("change", bs.reload);
bs.watch("css/*.css", function (event, file) {
  if (event === "change") {
    bs.reload("*.css");
  }
});

// 启动 Browsersync 服务器
bs.init({
  open: false,
  port: 9000,
  server: {
    baseDir: cmdRunDir,
    directory: true
  }
}, function () {
  // 如果存在index.html 则打开首页
  fs.exists(cmdRunDir + '/index.html', function (isExists) {
    if (isExists) {
      opn('http://localhost:9000/index.html')
    } else {
      opn('http://localhost:9000')
    }
  })
});