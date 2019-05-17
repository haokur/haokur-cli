/**
 * 开启静态(非vue或react类应用)可以热更新服务器
 */
const fs = require('fs');
const path = require('path');

const chokidar = require('chokidar');
const sass = require('node-sass');
const bs = require('browser-sync').create();
const opn = require('opn');
var gulp = require('gulp');
var ts = require('gulp-typescript');

// 运行命令目录
var cmdRunDir = process.cwd();

// 监听 sass 文件改变,生成 css 文件
chokidar
    .watch(cmdRunDir, {
        // ignored: /(^|[\/\\])\../
        ignored: '**/node_modules',
    })
    .on('change', (fullPath, stats) => {
        let {
            dir: fileDir,
            base: fileBase,
            ext: fileExt,
            name: fileName,
        } = path.parse(fullPath);
        if (fileExt === '.scss') {
            sass.render(
                {
                    file: fullPath,
                },
                function(err, result) {
                    fs.writeFile(
                        `${fileDir}/${fileName}.css`,
                        result.css,
                        function(err) {}
                    );
                }
            );
        } else if (fileExt === '.ts') {
            // console.log('检测到是ts文件')
            gulp.src(fullPath)
                .pipe(
                    ts({
                        noImplicitAny: true,
                        outFile: `${fileName}.js`,
                    })
                )
                .pipe(gulp.dest(fileDir));
        } else if (
            fileExt == '.html' ||
            fileExt === '.js' ||
            fileExt == '.css'
        ) {
            console.log('js文件变化');
            bs.reload(fullPath);
        }
    });

// 启动 Browsersync 服务器
bs.init(
    {
        open: true,
        // port: 9000,
        server: {
            baseDir: cmdRunDir,
            directory: true,
        },
    },
    function(err, bs) {
        // console.log(res, bs);
        console.log('bs.options.port', bs.options);
        // Object.keys(bs.options).forEach(key => {
        //   console.log(key);
        // });
        // Object.keys(bs).forEach(item => {
        //   console.log(item);
        //   if (typeof bs[item] === "object") {
        //     Object.keys(bs[item]).forEach(key => {
        //       console.log('    ',key);
        //     });
        //   }
        // });
        // 如果存在index.html 则打开首页
        // fs.exists(cmdRunDir + "/index.html", function(isExists) {
        //   if (isExists) {
        //     opn("http://localhost:9000/index.html");
        //   } else {
        //     opn("http://localhost:9000");
        //   }
        // });
    }
);
