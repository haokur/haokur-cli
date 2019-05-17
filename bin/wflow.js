#!/usr/bin/env node

const program = require('commander');

program
    .version('1.0.0')
    .usage('<command> [项目名称]')
    .command('init', '初始化项目')
    .command('kill', '杀对应端口进程')
    .command('ip', 'ip地址相关操作')
    .command('static', '静态热更新服务器')
    .command('tree', '文件树查看')
    .command('g', '自动生成项目文件')
    .parse(process.argv);
